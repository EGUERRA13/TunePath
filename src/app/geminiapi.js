import { ParseGeminiResponse } from "./parseresponse";
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function RunGemini(artistName) {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});

  const prompt = `Can you construct a flowchart using text for the musical artist ` + artistName + `'s discography. 
Start at the most noob friendly album then branch out according to mood and preferences.
Follow the structure exactly like the example response below created for Nirvana's discography. Be sure to copy even the placement of the asterisks.
When an edge leads to nowhere just put "End here" like the example below. Follow the structure exactly, only changing the information. Always make sure to end 
the flowchart with **End of Flowchart Response** just like the example below.

**Nirvana Discography Flowchart**

**Start with:** "Bleach" (1989)

* **Want something more grungy and raw:** Go to "In Utero" (1993)
* **Prefer a more polished and accessible sound:** Go to "Nevermind" (1991)

**Next Node Album: In Utero (1993):**

* **Like the chaotic and experimental side of Nirvana:** Go to "Incesticide" (1992)
* **Want something more melodic and introspective:** Go to "Unplugged in New York" (1994)

**Next Node Album: Nevermind (1991):**

* **Want more anthems and catchy hooks:** Go to "From the Muddy Banks of the Wishkah" (1996)
* **Prefer a darker and more introspective tone:** Go to "In Utero" (1993)

**Next Node Album: Incesticide (1992):**

* **Want more grunge and noise:** Go to "Bleach" (1989)
* **Prefer B-sides and rarities:** Go to "With the Lights Out" (2004)

**Next Node Album: Unplugged in New York (1994):**

* **Want a stripped-down and acoustic experience:** Go to "MTV Unplugged in New York" (1994)
* **Prefer a more experimental and improvised sound:** Go to "Incesticide" (1992)

**Next Node Album: From the Muddy Banks of the Wishkah (1996):**

* **Want more live recordings and rarities:** Go to "Live at Reading" (2009)
* **Prefer a compilation of their best studio tracks:** Go to "Nirvana" (2002)

**Next Node Album: Nirvana (2002):**

* **Want the essential Nirvana collection:** End here
* **Interested in further exploration:** Go to "With the Lights Out" (2004)

**Next Node Album: With the Lights Out (2004):**

* **Want more B-sides, demos, and rarities:** End here
* **Interested in a comprehensive box set:** Go to "With the Lights Out: The Complete Nirvana Sessions" (2004)

**End of Flowchart Response**`

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  

  return ParseGeminiResponse(text);
}

