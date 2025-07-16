import { createEmailNotification } from "./database"
import type { User, Order } from "./types"

export interface EmailTemplate {
  subject: string
  content: string
}

export class EmailService {
  private static instance: EmailService

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  async sendOrderConfirmation(user: User, order: Order): Promise<void> {
    const template = this.getOrderConfirmationTemplate(user, order)

    await createEmailNotification({
      userId: user.id,
      type: "order_confirmation",
      subject: template.subject,
      content: template.content,
      sent: false,
    })

    // In a real app, you would integrate with email service like SendGrid, Mailgun, etc.
    console.log(`📧 Order confirmation email queued for ${user.email}`)
  }

  async sendOrderShipped(user: User, order: Order): Promise<void> {
    const template = this.getOrderShippedTemplate(user, order)

    await createEmailNotification({
      userId: user.id,
      type: "order_shipped",
      subject: template.subject,
      content: template.content,
      sent: false,
    })

    console.log(`📦 Order shipped email queued for ${user.email}`)
  }

  async sendOrderDelivered(user: User, order: Order): Promise<void> {
    const template = this.getOrderDeliveredTemplate(user, order)

    await createEmailNotification({
      userId: user.id,
      type: "order_delivered",
      subject: template.subject,
      content: template.content,
      sent: false,
    })

    console.log(`✅ Order delivered email queued for ${user.email}`)
  }

  async sendWelcomeEmail(user: User): Promise<void> {
    const template = this.getWelcomeTemplate(user)

    await createEmailNotification({
      userId: user.id,
      type: "welcome",
      subject: template.subject,
      content: template.content,
      sent: false,
    })

    console.log(`👋 Welcome email queued for ${user.email}`)
  }

  private getOrderConfirmationTemplate(user: User, order: Order): EmailTemplate {
    return {
      subject: `Order Confirmation - ${order.id} | FROZEN THREAD`,
      content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #fff; margin: 0;">FROZEN THREAD</h1>
            <p style="color: #ccc; margin: 5px 0;">Premium Streetwear</p>
          </div>
          
          <h2 style="color: #fff;">Order Confirmed! 🎉</h2>
          <p>Hi ${user.name},</p>
          <p>Thank you for your order! We've received your order and are preparing it for shipment.</p>
          
          <div style="background: #111; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #fff; margin-top: 0;">Order Details</h3>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Total:</strong> ₹${order.total.toFixed(2)}</p>
          </div>
          
          <div style="background: #111; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #fff; margin-top: 0;">Items Ordered</h3>
            ${order.items
              .map(
                (item) => `
              <div style="border-bottom: 1px solid #333; padding: 10px 0;">
                <p style="margin: 0;"><strong>${item.productName}</strong></p>
                <p style="margin: 5px 0; color: #ccc;">Quantity: ${item.quantity} | Price: ₹${item.price.toFixed(2)}</p>
              </div>
            `,
              )
              .join("")}
          </div>
          
          <div style="background: #111; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #fff; margin-top: 0;">Shipping Address</h3>
            <p style="margin: 0;">${order.shippingAddress.name}</p>
            <p style="margin: 5px 0;">${order.shippingAddress.addressLine1}</p>
            <p style="margin: 5px 0;">${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}</p>
          </div>
          
          <p>We'll send you another email when your order ships. If you have any questions, feel free to contact us.</p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;">
            <p style="color: #ccc; font-size: 14px;">Thank you for choosing FROZEN THREAD</p>
            <p style="color: #ccc; font-size: 12px;">© 2024 FROZEN THREAD. All rights reserved.</p>
          </div>
        </div>
      `,
    }
  }

  private getOrderShippedTemplate(user: User, order: Order): EmailTemplate {
    return {
      subject: `Your Order is on the Way! - ${order.id} | FROZEN THREAD`,
      content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #fff; margin: 0;">FROZEN THREAD</h1>
            <p style="color: #ccc; margin: 5px 0;">Premium Streetwear</p>
          </div>
          
          <h2 style="color: #fff;">Your Order is on the Way! 📦</h2>
          <p>Hi ${user.name},</p>
          <p>Great news! Your order has been shipped and is on its way to you.</p>
          
          <div style="background: #111; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #fff; margin-top: 0;">Shipping Details</h3>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Tracking Number:</strong> ${order.trackingNumber || "Will be updated soon"}</p>
            <p><strong>Estimated Delivery:</strong> ${order.estimatedDelivery || "3-5 business days"}</p>
          </div>
          
          <p>You can track your package using the tracking number above. We'll send you another email when your order is delivered.</p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;">
            <p style="color: #ccc; font-size: 14px;">Thank you for choosing FROZEN THREAD</p>
            <p style="color: #ccc; font-size: 12px;">© 2024 FROZEN THREAD. All rights reserved.</p>
          </div>
        </div>
      `,
    }
  }

  private getOrderDeliveredTemplate(user: User, order: Order): EmailTemplate {
    return {
      subject: `Order Delivered! - ${order.id} | FROZEN THREAD`,
      content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #fff; margin: 0;">FROZEN THREAD</h1>
            <p style="color: #ccc; margin: 5px 0;">Premium Streetwear</p>
          </div>
          
          <h2 style="color: #fff;">Order Delivered! ✅</h2>
          <p>Hi ${user.name},</p>
          <p>Your order has been successfully delivered! We hope you love your new FROZEN THREAD items.</p>
          
          <div style="background: #111; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #fff; margin-top: 0;">Order Summary</h3>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Delivered on:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Total:</strong> ₹${order.total.toFixed(2)}</p>
          </div>
          
          <p>How was your experience? We'd love to hear your feedback! Consider leaving a review for the products you purchased.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background: #fff; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Leave a Review</a>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;">
            <p style="color: #ccc; font-size: 14px;">Thank you for choosing FROZEN THREAD</p>
            <p style="color: #ccc; font-size: 12px;">© 2024 FROZEN THREAD. All rights reserved.</p>
          </div>
        </div>
      `,
    }
  }

  private getWelcomeTemplate(user: User): EmailTemplate {
    return {
      subject: `Welcome to FROZEN THREAD! ❄️`,
      content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #fff; margin: 0;">FROZEN THREAD</h1>
            <p style="color: #ccc; margin: 5px 0;">Premium Streetwear</p>
          </div>
          
          <h2 style="color: #fff;">Welcome to the Family! 🎉</h2>
          <p>Hi ${user.name},</p>
          <p>Welcome to FROZEN THREAD! We're excited to have you join our community of streetwear enthusiasts.</p>
          
          <div style="background: #111; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #fff; margin-top: 0;">What's Next?</h3>
            <ul style="color: #ccc; padding-left: 20px;">
              <li>Explore our latest collections</li>
              <li>Follow us on social media for style inspiration</li>
              <li>Sign up for our newsletter for exclusive deals</li>
              <li>Join our community of fashion-forward individuals</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background: #fff; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 0 10px;">Shop Now</a>
            <a href="#" style="background: transparent; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; border: 1px solid #fff; margin: 0 10px;">Follow Us</a>
          </div>
          
          <p>If you have any questions, our customer support team is here to help. Welcome aboard!</p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;">
            <p style="color: #ccc; font-size: 14px;">Thank you for choosing FROZEN THREAD</p>
            <p style="color: #ccc; font-size: 12px;">© 2024 FROZEN THREAD. All rights reserved.</p>
          </div>
        </div>
      `,
    }
  }
}

export const emailService = EmailService.getInstance()
