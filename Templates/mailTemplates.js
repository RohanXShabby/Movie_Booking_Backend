export const emailVerification = () => {
    return `
        <div style="font-family: Poppins, sans-serif; line-height: 1.8; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #FF5733; text-align: center;">Welcome to Movie Square, ${'userName'}!</h1>
            <p style="font-size: 16px; text-align: center;">Your ultimate destination for booking movie tickets and enjoying the latest shows.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 14px; text-align: center;">Thank you for joining Movie Square! We are excited to have you as part of our community. Explore the latest movies, book your seats, and enjoy an amazing cinematic experience.</p>
            <div style="text-align: center; margin: 20px 0;">
            </div>
            <div style="text-align: center; margin: 20px 0;">
                <a href=${"VerifyUrl"} style="display: inline-block; background-color: #4CAF50; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 16px;">Verify Your Mail</a>
            </div>
            <p style="font-size: 14px; text-align: center;">If you have any questions or need assistance, feel free to reach out to us anytime.</p>
            <p style="font-size: 14px; text-align: center;">Best Regards,</p>
            <p style="font-size: 14px; text-align: center;"><strong>The Movie Square Team</strong></p>
        </div>
    `;
}