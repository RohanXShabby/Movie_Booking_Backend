export const optTemplate = (otp) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Password Reset OTP</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; padding: 20px 0; background: #007bff; color: white; border-radius: 5px 5px 0 0;">
                <h1 style="margin: 0; color: white;">Password Reset Request</h1>
            </div>
            <div style="padding: 20px;">
                <p style="margin: 0 0 15px 0;">Hello,</p>
                <p style="margin: 0 0 15px 0;">We received a request to reset your password. Please use the following OTP (One-Time Password) to proceed with your password reset:</p>
                
                <div style="font-size: 32px; font-weight: bold; text-align: center; letter-spacing: 5px; color: #007bff; margin: 20px 0; padding: 10px; background: #f8f9fa; border-radius: 5px;">
                    ${otp}
                </div>
                
                <p style="margin: 0 0 15px 0;">This OTP is valid for 10 minutes. If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
                
                <p style="margin: 0 0 15px 0;">For security reasons, please do not share this OTP with anyone.</p>
                
                <p style="margin: 0 0 15px 0;">Best regards,<br>Your Application Team</p>
            </div>
            <div style="text-align: center; padding: 20px; font-size: 12px; color: #666; border-top: 1px solid #eee;">
                <p style="margin: 0;">This is an automated message, please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>
    `
}