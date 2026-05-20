const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    coverImage: { type: String, required: true },
    soldCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

const Book = mongoose.models.Book || mongoose.model('Book', bookSchema);

const comprehensiveRetailInventory = [
    // === GENRE: FICTION (7 Books) ===
    {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Fiction",
        description: "The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.",
        price: 95000,
        stock: 15,
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/81Q79V7vBuL.jpg",
        soldCount: 0,
        createdAt: new Date("2026-01-01")
    },
    {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Fiction",
        description: "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.",
        price: 110000,
        stock: 12,
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/81gepf1eMqL.jpg",
        soldCount: 0,
        createdAt: new Date("2026-01-02")
    },
    {
        title: "1984",
        author: "George Orwell",
        genre: "Fiction",
        description: "A dystopian masterpiece world dominated by Big Brother and the terrifying control of Thought Police.",
        price: 88000,
        stock: 25,
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/71kxa8W9yDL.jpg",
        soldCount: 0,
        createdAt: new Date("2026-01-03")
    },
    {
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        genre: "Fiction",
        description: "The classic novel of teenage angst and alienation, narrated by the iconic Holden Caulfield.",
        price: 99000,
        stock: 10,
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/81OthjkJbuL.jpg",
        soldCount: 0,
        createdAt: new Date("2026-01-04")
    },
    {
        title: "Normal People",
        author: "Sally Rooney",
        genre: "Fiction",
        description: "An exquisite love story about how one person can change another person's life, tracing two connected lives.",
        price: 125000,
        stock: 8,
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/817tHNcyAgL.jpg",
        soldCount: 0,
        createdAt: new Date("2026-01-05")
    },
    {
        title: "The Midnight Library",
        author: "Matt Haig",
        genre: "Fiction",
        description: "Between life and death there is a library, and within that library, the shelves go on forever.",
        price: 105000,
        stock: 14,
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/81J6APjwxlL.jpg",
        soldCount: 0,
        createdAt: new Date("2026-01-06")
    },
    {
        title: "Where the Crawdads Sing",
        author: "Delia Owens",
        genre: "Fiction",
        description: "An exquisite ode to the natural world, a heartbreaking coming-of-age story, and a surprising murder tale.",
        price: 120000,
        stock: 11,
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/81HAUt690NL.jpg",
        soldCount: 0,
        createdAt: new Date("2026-01-07")
    },

    // === GENRE: SELF-DEVELOPMENT (6 Books) ===
    {
        title: "Atomic Habits",
        author: "James Clear",
        genre: "Self-Development",
        description: "Tiny Changes, Remarkable Results. An easy and proven way to build good habits and break bad ones.",
        price: 108000,
        stock: 30,
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/81wgcld4wxL.jpg",
        soldCount: 0,
        createdAt: new Date("2026-01-08")
    },
    {
        title: "Deep Work",
        author: "Cal Newport",
        genre: "Self-Development",
        description: "Rules for focused success in a distracted world. Master cognitive tasks through deep concentration techniques.",
        price: 115000,
        stock: 15,
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/61Snc8vM6tL.jpg",
        soldCount: 0,
        createdAt: new Date("2026-01-09")
    },
    {
        title: "Show Your Work!",
        author: "Austin Kleon",
        genre: "Self-Development",
        description: "10 ways to share your creativity and get discovered. An essential manifesto for succeeding in the digital age.",
        price: 85000,
        stock: 22,
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/618-USt6SGL.jpg",
        soldCount: 0,
        createdAt: new Date("2026-01-10")
    },
    {
        title: "Can't Hurt Me",
        author: "David Goggins",
        genre: "Self-Development",
        description: "Master Your Mind and Defy the Odds. The incredible life journey of a Navy SEAL transformed through mental toughness.",
        price: 140000,
        stock: 18,
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/81g8vU-C6JL.jpg",
        soldCount: 0,
        createdAt: new Date("2026-01-11")
    },
    {
        title: "The Subtle Art of Not Giving a F*ck",
        author: "Mark Manson",
        genre: "Self-Development",
        description: "A counterintuitive approach to living a good life, cutting through psychological filler to seek true meaning.",
        price: 95000,
        stock: 25,
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/71QKQ9mwV7L.jpg",
        soldCount: 0,
        createdAt: new Date("2026-01-12")
    },
    {
        title: "Start With Why",
        author: "Simon Sinek",
        genre: "Self-Development",
        description: "How great leaders inspire everyone to take action by defining the core mission parameters of organizational structures.",
        price: 110000,
        stock: 14,
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/71b8A2zoSjL.jpg",
        soldCount: 0,
        createdAt: new Date("2026-01-13")
    },

    // === GENRE: NON-FICTION (6 Books) ===
    {
        title: "Sapiens",
        author: "Yuval Noah Harari",
        genre: "Non-Fiction",
        description: "A Brief History of Humankind. Explores how biology and history have defined us and enhanced our understanding of society.",
        price: 155000,
        stock: 12,
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/713jIoMO3UL.jpg",
        soldCount: 0,
        createdAt: new Date("2026-01-14")
    },
    {
        title: "Educated",
        author: "Tara Westover",
        genre: "Non-Fiction",
        description: "An unforgettable memoir about a young girl who leaves her survivalist family in Idaho to pursue academic learning.",
        price: 120000,
        stock: 8,
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/81WojUxbbFL.jpg",
        soldCount: 0,
        createdAt: new Date("2026-01-15")
    },
    {
        title: "Thinking, Fast and Slow",
        author: "Daniel Kahneman",
        genre: "Non-Fiction",
        description: "A monumental exploration of the dual cognitive machinery driving human judgment and operational decision errors.",
        price: 145000,
        stock: 10,
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/71f6v0vpAOL.jpg",
        soldCount: 0,
        createdAt: new Date("2026-01-16")
    },
    {
        title: "Outliers",
        author: "Malcolm Gladwell",
        genre: "Non-Fiction",
        description: "The Story of Success. Explores the cultural, environmental, and structural parameters that cultivate high achievers.",
        price: 105000,
        stock: 15,
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/61N77N5gSXL.jpg",
        soldCount: 0,
        createdAt: new Date("2026-01-17")
    },
    {
        title: "Quiet",
        author: "Susan Cain",
        genre: "Non-Fiction",
        description: "The Power of Introverts in a World That Can't Stop Talking. Explores how introversion shapes our operational systems.",
        price: 115000,
        stock: 14,
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/81D9gZ6ySML.jpg",
        soldCount: 0,
        createdAt: new Date("2026-01-18")
    },
    {
        title: "Bad Blood",
        author: "John Carreyrou",
        genre: "Non-Fiction",
        description: "Secrets and Lies in a Silicon Valley Startup. The full investigative narrative behind the Theranos medical technology fraud.",
        price: 130000,
        stock: 9,
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/81v7K3Xf9mL.jpg",
        soldCount: 0,
        createdAt: new Date("2026-01-19")
    },

    // === GENRE: COMIC & GRAPHIC NOVELS (6 Books) ===
    {
        title: "One Piece, Vol. 1",
        author: "Eiichiro Oda",
        genre: "Comic & Graphic Novels",
        description: "Monkey D. Luffy sets out to sea in search of the ultimate pirate treasure infrastructure known as One Piece.",
        price: 45000,
        stock: 50,
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/81N0G+Y16gL.jpg",
        soldCount: 0,
        createdAt: new Date("2026-01-20")
    },
    {
        title: "Spy x Family, Vol. 1",
        author: "Tatsuya Endo",
        genre: "Comic & Graphic Novels",
        description: "A master spy, an assassin, and a telepath establish a fake family node to protect global peace parameters.",
        price: 45000,
        stock: 40,
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/71ZpT-0SctL.jpg",
        soldCount: 0,
        createdAt: new Date("2026-01-21")
    },
    {
        title: "Demon Slayer, Vol. 1",
        author: "Koyoharu Gotouge",
        genre: "Comic & Graphic Novels",
        description: "Tanjiro sets off on a dangerous quest to find a cure for his sister and avenge his family's destruction.",
        price: 45000,
        stock: 35,
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/81S88Z8E2fL.jpg",
        soldCount: 0,
        createdAt: new Date("2026-01-22")
    },
    {
        title: "Jujutsu Kaisen, Vol. 1",
        author: "Gege Akutami",
        genre: "Comic & Graphic Novels",
        description: "Yuji Itadori swallows a cursed object to save a friend, entering the secret world of Jujutsu Sorcerers.",
        price: 45000,
        stock: 30,
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/81t3Acl7nGL.jpg",
        soldCount: 0,
        createdAt: new Date("2026-01-23")
    },
    {
        title: "Attack on Titan, Vol. 1",
        author: "Hajime Isayama",
        genre: "Comic & Graphic Novels",
        description: "Humanity fights for survival inside walled cities against giant man-eating creatures known as Titans.",
        price: 45000,
        stock: 25,
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/91L1m8KsttL.jpg",
        soldCount: 0,
        createdAt: new Date("2026-01-24")
    },
    {
        title: "Monster, Vol. 1",
        author: "Naoki Urasawa",
        genre: "Comic & Graphic Novels",
        description: "A brilliant neurosurgeon's life falls into chaos after saving a young boy who grows up to be a serial killer.",
        price: 125000,
        stock: 15,
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/81v7T9m1wVL.jpg",
        soldCount: 0,
        createdAt: new Date("2026-01-25")
    },

    // === GENRE: TECHNOLOGY & SCIENCE (5 Books) ===
    {
        title: "Clean Code",
        author: "Robert C. Martin",
        genre: "Technology & Science",
        description: "A Handbook of Agile Software Craftsmanship. Technical patterns for structured refactoring workflows.",
        price: 195000,
        stock: 12,
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/41xShbXbyZL.jpg",
        soldCount: 0,
        createdAt: new Date("2026-01-26")
    },
    {
        title: "Introduction to Algorithms",
        author: "Thomas H. Cormen",
        genre: "Technology & Science",
        description: "Comprehensive blueprint of modern algorithm structures, calculation mechanics, and execution sorting logic.",
        price: 275000,
        stock: 5,
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/61Mw8467g1L.jpg",
        soldCount: 0,
        createdAt: new Date("2026-01-27")
    },
    {
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt",
        genre: "Technology & Science",
        description: "Your journey to mastery. Explores professional software construction methodologies and logic engineering.",
        price: 185000,
        stock: 10,
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/41uPjE4K4ML.jpg",
        soldCount: 0,
        createdAt: new Date("2026-01-28")
    },
    {
        title: "Design Patterns",
        author: "Erich Gamma",
        genre: "Technology & Science",
        description: "Elements of Reusable Object-Oriented Software. The foundation blueprint for corporate system architecture patterns.",
        price: 220000,
        stock: 6,
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/81gtKoapnmL.jpg",
        soldCount: 0,
        createdAt: new Date("2026-01-29")
    },
    {
        title: "You Don't Know JS Yet",
        author: "Kyle Simpson",
        genre: "Technology & Science",
        description: "Get Started. Deep investigation into compilation runtimes, closures, scoping mechanisms, and type structures.",
        price: 95000,
        stock: 20,
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/7187bX6f7vL.jpg",
        soldCount: 0,
        createdAt: new Date("2026-01-30")
    },

    // === GENRE: BIOGRAPHY & HISTORY (5 Books) ===
    {
        title: "Steve Jobs",
        author: "Walter Isaacson",
        genre: "Biography & History Ledger",
        description: "The exclusive, definitive biography of the creative technology pioneer who revolutionized consumer device layouts.",
        price: 165000,
        stock: 8,
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/81VStYfLkGL.jpg",
        soldCount: 0,
        createdAt: new Date("2026-05-18") // Newest Date 1
    },
    {
        title: "Elon Musk",
        author: "Walter Isaacson",
        genre: "Biography & History Ledger",
        description: "The astonishingly intimate story of the controversial innovator who guided global rocket and electric vehicle grids.",
        price: 185000,
        stock: 12,
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/81979v5mE6L.jpg",
        soldCount: 0,
        createdAt: new Date("2026-05-19") // Newest Date 2
    },
    {
        title: "The Diary of a Young Girl",
        author: "Anne Frank",
        genre: "Biography & History Ledger",
        description: "The historic journal documenting a young girl's life hidden inside secret annex quarters during wartime occupation.",
        price: 75000,
        stock: 15,
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/810u9M74pSL.jpg",
        soldCount: 0,
        createdAt: new Date("2026-05-20") // Newest Date 3
    },
    {
        title: "Alexander the Great",
        author: "Philip Freeman",
        genre: "Biography & History Ledger",
        description: "Biography tracking the tactical campaigns and rapid expansion of the ancient world's most formidable empire.",
        price: 135000,
        stock: 7,
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/71x4N+n6RKL.jpg",
        soldCount: 0,
        createdAt: new Date("2026-05-21") // Newest Date 4
    },
    {
        title: "Leonardo da Vinci",
        author: "Walter Isaacson",
        genre: "Biography & History Ledger",
        description: "An investigation mapping the intersection of art, anatomy, and engineering inside the Italian polymath's journals.",
        price: 175000,
        stock: 5,
        coverImage: "https://images-na.ssl-images-amazon.com/images/I/816aRzXylmL.jpg",
        soldCount: 0,
        createdAt: new Date("2026-05-22") // Newest Date 5
    }
];

async function executeDatabaseSeeding() {
    try {
        const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/litera-bookstore"; 
        await mongoose.connect(mongoUri);
        console.log("[Seeder]: Connected to MongoDB Cluster successfully.");

        await Book.deleteMany({});
        console.log("[Seeder]: Dropped old book collection references.");

        await Book.insertMany(comprehensiveRetailInventory);
        console.log("[Seeder]: 35 global popular books injected successfully (No reviews/ratings).");

        await mongoose.connection.close();
        console.log("[Seeder]: Connection closed securely.");
        process.exit(0);
    } catch (error) {
        console.error("[Seeder Error]: Execution failed:", error);
        process.exit(1);
    }
}

executeDatabaseSeeding();