import CheckoutForm from "@/components/checkout/checkout-form"

export default function CheckoutPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Checkout</h1>
          <p className="text-slate-400">Complete Your Order</p>
        </div>

        <CheckoutForm />
      </div>
    </div>
  )
}
