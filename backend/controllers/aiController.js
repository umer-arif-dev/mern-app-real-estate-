// require("dotenv").config();

// const OpenAI = require("openai");

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// console.log("API KEY:", process.env.OPENAI_API_KEY);

// const generateDescription = async (req, res) => {
//   try {
//     const { title, location, price, bedrooms, bathrooms, area } = req.body;

//     const prompt = `
//       Write a professional real estate property description.

//       Title: ${title}
//       Location: ${location}
//       Price: ${price}
//       Bedrooms: ${bedrooms}
//       Bathrooms: ${bathrooms}
//       Area: ${area} sqft

//       Make it luxurious, attractive, and sales-oriented.
//     `;

//     const response = await openai.chat.completions.create({
// model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],
//     });

//     res.json({
//       description: response.choices[0].message.content,
//     });
//   } catch (error) {
//   console.log("🔥 OPENAI ERROR:", error);
//   return res.status(500).json({
//     message: error.message,
//     full: error,
//   });
// }
// };

// module.exports = { generateDescription };

require("dotenv").config();

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log("API KEY:", process.env.OPENAI_API_KEY);

const generateDescription = async (req, res) => {
  try {
    const { title, location, price, bedrooms, bathrooms, area } = req.body;

    const prompt = `
Write a professional real estate property description.

Title: ${title}
Location: ${location}
Price: ${price}
Bedrooms: ${bedrooms}
Bathrooms: ${bathrooms}
Area: ${area} sqft

Make it luxurious, attractive, and sales-oriented.
    `;

    // 🔥 TRY OPENAI FIRST
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return res.json({
      description: response.choices[0].message.content,
      source: "openai",
    });

  } catch (error) {
    console.log("🔥 OPENAI ERROR:", error);

    // 🟢 FREE FALLBACK RESPONSE
    const { title, location, price, bedrooms, bathrooms, area } = req.body;

    const fallbackDescription = `
🏡 ${title}

Located in ${location}, this beautiful property offers modern living with premium design and comfort.

💰 Price: ${price}
🛏 Bedrooms: ${bedrooms}
🛁 Bathrooms: ${bathrooms}
📐 Area: ${area} sqft

This home is perfect for families looking for luxury and convenience in a prime location.

✨ A great opportunity to invest in ${location} real estate market.
    `;

    return res.json({
      description: fallbackDescription,
      source: "fallback",
    });
  }
};

module.exports = { generateDescription };