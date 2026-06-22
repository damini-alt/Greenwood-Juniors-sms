# Email Automation Setup Guide

This guide explains how to set up the LLM block, Code block, and HTML Email template for Greenwood Juniors.

## 1. LLM Tool (Ask LLM) Configuration

Set your LLM prompt to output in JSON format so that the Code block can parse it reliably.

### System Prompt / Instructions:
```text
You are an educational assistant at Greenwood Juniors. Generate a parent notification email.
Return the output strictly as a JSON object with two keys: "subject" and "body".

Example Output Format:
{
  "subject": "Absence Alert: Student Name - Date",
  "body": "Dear Parent, ..."
}

Do not include any markdown styling like ```json or additional explanation. Return raw JSON text only.
```

---

## 2. Code Tool (JavaScript)

Use this Javascript code in your **Code Block** to receive the LLM output, parse the JSON, and separate the `subject` and `body`.

### JavaScript Code:
```javascript
export const code = async (inputs) => {
  const rawText = inputs.llmResponse.trim();
  
  try {
    // Try to parse the JSON output from the LLM
    const parsed = JSON.parse(rawText);
    return {
      subject: parsed.subject || "Notification from Greenwood Juniors",
      body: parsed.body || rawText
    };
  } catch (error) {
    // Fallback parsing if LLM outputs markdown formatting or plain text
    let cleanText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    try {
      const parsed = JSON.parse(cleanText);
      return {
        subject: parsed.subject || "Notification from Greenwood Juniors",
        body: parsed.body || cleanText
      };
    } catch (e) {
      // Manual regex fallback if JSON parsing fails completely
      const subjectMatch = rawText.match(/"subject"\s*:\s*"(.*?)"/s);
      const bodyMatch = rawText.match(/"body"\s*:\s*"(.*?)"/s);
      
      return {
        subject: subjectMatch ? subjectMatch[1] : "Notification from Greenwood Juniors",
        body: bodyMatch ? bodyMatch[1] : rawText
      };
    }
  }
};
```

---

## 3. HTML Email Card Template

In your **Gmail Tool (Send Email)** configuration, set the email body format to **HTML** and use the following template:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Greenwood Juniors Notification</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  
  <!-- Main Card Container -->
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
    
    <!-- 1. Top 100% Width Green Header Bar -->
    <tr>
      <td height="12" style="background-color: #0D5C3A; font-size: 0px; line-height: 0px;">&nbsp;</td>
    </tr>
    
    <!-- 2. Centered Logo Area -->
    <tr>
      <td align="center" style="padding: 30px 20px; background-color: #FAF9F6; border-bottom: 1px solid #edf2f7;">
        <img src="https://raw.githubusercontent.com/damini-alt/Greenwood-Juniors-sms/main/public/images/logo.png" 
             alt="Greenwood Juniors Logo" 
             width="160" 
             style="display: block; max-width: 100%; height: auto; outline: none; border: none;">
      </td>
    </tr>
    
    <!-- 3. Cream Main Content Section -->
    <tr>
      <td style="padding: 40px 30px; background-color: #FAF9F6;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="color: #2d3748; font-size: 16px; line-height: 1.6;">
              <!-- Dynamic Body content from Code block -->
              {{code_block_output.body}}
            </td>
          </tr>
          
          <!-- 4. Orange CTA Button -->
          <tr>
            <td align="center" style="padding-top: 35px;">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" bgcolor="#FF6F00" style="border-radius: 6px;">
                    <a href="https://parent.greenwoodjuniors.com" 
                       target="_blank" 
                       style="font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; padding: 14px 35px; display: inline-block; border-radius: 6px; border: 1px solid #FF6F00;">
                      View Portal Details
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    
    <!-- 5. Footer (Green Background) -->
    <tr>
      <td align="center" style="padding: 25px 20px; background-color: #0D5C3A; color: #ffffff; font-size: 13px; line-height: 1.5;">
        <span style="font-weight: 600;">Greenwood Juniors Academy</span><br>
        123 Education Drive, City Center<br>
        <span style="opacity: 0.85;">This is an automated notification. Please do not reply directly to this email.</span>
      </td>
    </tr>
    
  </table>
  
</body>
</html>
```
