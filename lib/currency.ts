// Indian Rupee currency utilities
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price)
}

export const formatPriceCompact = (price: number): string => {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(1)}Cr`
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(1)}L`
  } else if (price >= 1000) {
    return `₹${(price / 1000).toFixed(1)}K`
  }
  return `₹${price}`
}

export const convertUSDToINR = (usdPrice: number, exchangeRate = 83): number => {
  return Math.round(usdPrice * exchangeRate)
}
