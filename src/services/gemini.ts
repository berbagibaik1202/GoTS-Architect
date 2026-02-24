import { GoogleGenAI, Type } from "@google/genai";
import { ProjectState, Module } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateModule(
  currentState: ProjectState, 
  newModuleRequest: string
): Promise<ProjectState> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `You are an expert full-stack developer. You are building a modular application with a Go backend and a React + TypeScript frontend.
    
    CURRENT PROJECT STATE:
    - Project Name: ${currentState.name}
    - Visual Style: ${currentState.style}
    - Modules: ${JSON.stringify(currentState.modules)}
    - Files: ${currentState.files.map(f => f.path).join(', ')}
    
    TASK:
    Add a new module or update the project based on this request: "${newModuleRequest}".
    
    CRITICAL REQUIREMENTS FOR DATA RELATIONSHIPS & CONSISTENCY:
    1. ANALYZE EXISTING STATE: Before generating, carefully review the current modules and files to understand existing data structures and relationships.
    2. VISUAL STYLE: Strictly adhere to the requested visual style: "${currentState.style}". Use modern Tailwind CSS patterns (e.g., glassmorphism, bento grids, sophisticated typography, smooth transitions).
    3. DATA RELATIONSHIPS: Ensure new modules are related to existing ones where logical (e.g., if adding 'Orders', link it to 'Customers' via CustomerID).
    4. BACKEND CONSISTENCY: 
       - Update Go structs and database schemas to include foreign keys and relationships.
       - Use consistent naming conventions and shared database utility functions.
       - ALWAYS include a "backend/.env" file with "GEMINI_API_KEY=" placeholder.
    5. FRONTEND CONSISTENCY:
       - Ensure shared TypeScript interfaces are updated or created to reflect relationships.
       - Navigation and UI components must be updated to allow seamless transitions between related data.
    6. DOCUMENTATION: ALWAYS include a "README.md" file in the root of the generated project explaining the build process (Go build for backend, Vite build for frontend) and how to configure the Gemini API key.
    7. MODULAR INTEGRATION: The new module must not be isolated; it must be a functional part of the existing ecosystem.
    
    Return the result as a JSON object:
    {
      "name": "Project Name",
      "modules": [ ...updated list of modules with relationship metadata... ],
      "files": [ ...FULL updated set of files reflecting all changes and relationships... ],
      "readme": "Updated Markdown with relationship diagrams or explanations"
    }
    
    Ensure the code is production-ready, functional, and maintains strict data integrity.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          modules: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                type: { type: Type.STRING },
                description: { type: Type.STRING },
                fields: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      label: { type: Type.STRING },
                      type: { type: Type.STRING },
                      required: { type: Type.BOOLEAN }
                    },
                    required: ["name", "label", "type", "required"]
                  }
                }
              },
              required: ["id", "name", "type", "description"]
            }
          },
          files: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                content: { type: Type.STRING },
                language: { type: Type.STRING },
                path: { type: Type.STRING }
              },
              required: ["name", "content", "language", "path"]
            }
          },
          readme: { type: Type.STRING }
        },
        required: ["name", "modules", "files", "readme"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}") as ProjectState;
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Invalid response from AI");
  }
}
