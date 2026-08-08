const { createClient } = require('@libsql/client');
const fs = require('fs');

async function main() {
  const url = "libsql://bakale-store-sushrut007.aws-ap-northeast-1.turso.io";
  const authToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODYxODAxNjgsImlkIjoiMDE5ZmUwOGYtNDUwMS03Y2JiLTk5ZjctYWNjM2NmMmUxYWQ1Iiwia2lkIjoiNko1cUxOb1JyVHBwcEg0SjRWSlVhUWJ2TjRGbmpDTmFIelctVkFNeFhycyIsInJpZCI6IjZmMjZmNmZmLTZhOTUtNDExMy1hNTlkLTk1OTM4OTgyMGMyOCJ9.H4uF4aveyfLX2MfY5BNQ-is_s_CQeG0AsWB8MMc1b_AryzlvwIvIOcL9aWkt8pR2NY1VR_3DN0j56f7UDLbpBQ";
  
  const db = createClient({ url, authToken });
  
  const schema = fs.readFileSync('./schema.sql', 'utf8');
  
  // Split statements by semicolon and execute them sequentially
  // Note: we remove any trailing empty statements
  const statements = schema.split(';').map(s => s.trim()).filter(s => s.length > 0);
  
  console.log(`Executing ${statements.length} SQL statements on Turso...`);
  
  for (const stmt of statements) {
    try {
      await db.execute(stmt);
      console.log("Successfully executed statement");
    } catch (err) {
      console.error("Error executing statement:", err);
      // We continue on error in case the table already exists
    }
  }
  
  console.log("Finished pushing schema to Turso.");
}

main().catch(console.error);
