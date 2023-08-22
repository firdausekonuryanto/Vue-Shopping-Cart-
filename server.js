const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const ObjectID = require("mongodb").ObjectId;
const { MongoClient } = require("mongodb");
const session = require("express-session"); 
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  app.use(
    cors({
      methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    })
  );
  next();
});

app.use("/public/uploads", express.static(path.join(__dirname, "/public/uploads")));
app.use("/public/transactions", express.static(path.join(__dirname, "/public/transactions")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "/public/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const storage_transactions = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "/public/transactions"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
const upload_transactions = multer({ storage: storage_transactions });

app.use(
  session({
    secret: "adskfiaek^dkfdkfa", // rahasia ini dapat diganti
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware to verify token
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }
  
  jwt.verify(token, "rahasia_token", (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err);
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
}

const connectToMongoDB = async () => {
  const client = new MongoClient("mongodb://127.0.0.1:27017", {
    useUnifiedTopology: true,
  });

  try {
    await client.connect();

    const db = client.db("vue-example");
    const productsCollection = db.collection("products");
    const membersCollection = db.collection("members");
    const transactionsCollection = db.collection("transactions");
    const transactionitemsCollection = db.collection("transactionitems");

    return {
      productsCollection,
      membersCollection,
      transactionsCollection,
      transactionitemsCollection,
    };
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    throw error;
  }
};

app.post("/login",
  bodyParser.urlencoded(),
  async (req, res, next) => {
    const { username, password } = req.body;
    const saltRounds = 10; // Number of salt rounds
    this.password = await bcrypt.hash(req.body.password, saltRounds);
    
    try {
      const { membersCollection } = await connectToMongoDB();
      const member = await membersCollection.findOne({ username });
      if (!member || !bcrypt.compareSync(password, member.password)) {
        return res.status(401).json({ success: false, message: "Authentication failed" });
      }
      const token = jwt.sign({ username }, "rahasia_token"); // Replace with your secret key
      res.send({
        success: true,
        message: "Login successful",
        token,
        username: username,
        id_member: member._id.toString(),
        is_staff: member.is_staff,
      });

      next();
    } catch (err) {
      console.error("Error finding member:", err);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
);

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {});
  res.send("Thank you! Visit again");
});

// ----------------------------------------------- start products --------------------------------------------------
app.get("/products", verifyToken, async (req, res) => {
  try {
    const { productsCollection } = await connectToMongoDB();
    const data = await productsCollection.find({}).toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving data", error });
  }
});

app.get("/products/:productId", verifyToken, async (req, res) => {
  try {
    const { productsCollection } = await connectToMongoDB();
    const id = new ObjectID(req.params.productId);
    const product = await productsCollection.findOne({ _id: id }); // Assuming you're using ObjectId for your product IDs
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving product data", error });
  }
});


app.post("/products", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { productsCollection } = await connectToMongoDB();
    const newData = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      image: req.file ? req.file.filename : "",
    };
    const result = await productsCollection.insertOne(newData);
    res.json(newData);
  } catch (error) {
    res.status(500).json({ message: "Error inserting data", error });
  }
});

app.put("/products/:id", verifyToken, upload.single("image"), async (req, res) => {
  const id = new ObjectID(req.params.id);

  try {
    const { productsCollection } = await connectToMongoDB();
    const existingProduct = await productsCollection.findOne({ _id: id });

    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    if (req.file) {
      const oldImageFilename = existingProduct.image;
      if (oldImageFilename) {
        // Remove the old image file from the server's filesystem
        fs.unlinkSync(`public/uploads/${oldImageFilename}`);
      }
    }

    const updatedProduct = {
      ...existingProduct,
      ...req.body,
      image: req.file ? req.file.filename : existingProduct.image,
    };
    delete updatedProduct._id;

    console.log("Updated product:", updatedProduct);

    const result = await productsCollection.updateOne({ _id: id }, { $set: updatedProduct });
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating data", error);
    res.status(500).json({ message: "Error updating data", error });
  }
});

app.delete("/products/:id", verifyToken, async (req, res) => {
  try {
    const { productsCollection } = await connectToMongoDB();
    const id = new ObjectID(req.params.id);
    const product = await productsCollection.findOne({ _id: id });
    const result = await productsCollection.deleteOne({ _id: id });

    if (result.deletedCount === 1) {
      const imagePath = `uploads/${product.image}`;
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image file", err);
        } else {
          console.log("Image file deleted successfully");
        }
      });

      res.json({ message: "Product deleted successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting data", error });
  }
});

app.get("/api/images", async (req, res) => {
  try {
    const { productsCollection } = await connectToMongoDB();
    const data = await productsCollection.find({}).toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving data", error });
  }
});
// ----------------------------------------------- end products --------------------------------------------------

// ----------------------------------------------- start member data --------------------------------------------------
app.get("/members", verifyToken, async (req, res) => {
  try {
    const { membersCollection } = await connectToMongoDB();
    const data = await membersCollection.find({}).toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving data", error });
  }
});

app.post("/members",  async (req, res) => {
  try {
    const { membersCollection } = await connectToMongoDB();
    const { name, gender, phone, email, username, password, is_staff } = req.body;

    const saltRounds = 10; // Number of salt rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newData = {
      name: name,
      gender: gender,
      phone: phone,
      email: email,
      username: username,
      password: hashedPassword, // Store the hashed password in the database
      is_staff: is_staff,
    };

    const result = await membersCollection.insertOne(newData);
    res.json(newData);
  } catch (error) {
    res.status(500).json({ message: "Error inserting data", error });
  }
});

app.put("/members/:id", verifyToken, async (req, res) => {
  const id = new ObjectID(req.params.id);
  try {
    const { membersCollection } = await connectToMongoDB();
    const { name, gender, phone, email, username, is_staff } = req.body;

    const updateMember = {
      name: name,
      gender: gender, 
      phone: phone, 
      email: email, 
      username: username, 
      is_staff: is_staff, 
    };

    const result = await membersCollection.updateOne({ _id: id }, { $set: updateMember });
    res.json(updateMember);
  } catch (error) {
    console.error("Error updating data", error);
    res.status(500).json({ message: "Error updating data", error });
  }
});

app.delete("/members/:id", verifyToken, async (req, res) => {
  try {
    const { membersCollection } = await connectToMongoDB();
    const id = new ObjectID(req.params.id);
    await membersCollection.deleteOne({ _id: id });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting data", error });
  }
});

// ----------------------------------------------- end member data --------------------------------------------------

// ----------------------------------------------- start transactions and transactionitems --------------------------------------------------

app.get("/transactions", verifyToken, async (req, res) => {
  try {
    const { transactionsCollection } = await connectToMongoDB();  
    if (req.query.is_staff == 'true') {
      //----------------------- ini admin
      const query = {};
      if (req.query.startDate && req.query.endDate) {
        const startDate = new Date(req.query.startDate); // Parse the date string
        const endDate = new Date(req.query.endDate); // Parse the date string
        query.purchase_date = {
          $gte: startDate.toISOString(),
          $lte: endDate.toISOString()
        };
        const data = await transactionsCollection.find(query).toArray();
        res.json(data);
      }  else {
          const data = await transactionsCollection.find({}).toArray();
          res.json(data);
        }  
    } else {
      //----------------------- ini bukan admin
      const id_member = req.query.id_member;
      console.log(id_member);
      let query = { id_member: id_member };
      if(req.query.startDate && req.query.endDate ){

          const startDate = new Date(req.query.startDate);
          const endDate = new Date(req.query.endDate);
          query.purchase_date = {
            $gte: startDate.toISOString(),
            $lte: endDate.toISOString()
          };
        const data = await transactionsCollection.find(query).toArray();
        res.json(data);
        } else {
          const data = await transactionsCollection.find(query).toArray();
          res.json(data);
        } 
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error retrieving data", error });
  }
});

app.get("/transactionitems", verifyToken, async (req, res) => {
  try {
    const { transactionitemsCollection } = await connectToMongoDB();
    const data = await transactionitemsCollection.find({}).toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving data", error });
  }
});

app.post("/transactions", verifyToken, upload_transactions.single("image"), async (req, res) => {
  try {
    const newTransaction = {
      id_member: req.body.id_member,
      purchase_date: req.body.purchase_date,
      total_amount: req.body.total_amount,
      image: req.file ? req.file.filename : "",
    };
    console.log(newTransaction);
    const { transactionsCollection } = await connectToMongoDB();
    const result = await transactionsCollection.insertOne(newTransaction);
    const insertedId = result.insertedId;
    res.status(201).json({ newTransaction, insertedIds: [insertedId] });
  } catch (error) {
    console.error("Gagal menyimpan data transaksi ke MongoDB:", error);
    res.status(500).json({ error: "Gagal menyimpan data transaksi" });
  }
});

app.post("/transactionitems", verifyToken, async (req, res) => {
  try {
    const newTransactionItems = req.body;
    console.log(newTransactionItems);
    const { transactionitemsCollection } = await connectToMongoDB();
    const result = await transactionitemsCollection.insertMany(newTransactionItems);
    const insertedIds = result.insertedIds;

    res.status(201).json({ insertedIds });
  } catch (error) {
    console.error("Gagal menyimpan data transaksi barang ke MongoDB:", error);
    res.status(500).json({ error: "Gagal menyimpan data transaksi barang" });
  }
});
// ----------------------------------------------- end submitOrder --------------------------------------------------

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
