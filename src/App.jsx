import { useState, useEffect } from 'react'
import './App.css'

function App() {
const [products, setProducts] = useState([])
const[errorMsg,setErrorMsg] = useState("")
const[isLoading, setIsLoading] = useState(true)
const [filter, setFilter] = useState("all")
const [searchInput, setSearchInput] = useState("")
const [priceFilter, setPriceFilter] = useState("default-order")
const [cartProducts, setCartProducts] =  useState(() => JSON.parse(localStorage.getItem("cart")) ||[])
const [showCart, setShowCart] = useState(false)


const filteredProducts = filter === "men's clothing" ? products.filter(product => product.category === "men's clothing") : filter === "women's clothing" ? products.filter(product => product.category === "women's clothing") : filter === "jewelery" ? products.filter(product => product.category === "jewelery") : filter === "electronics" ? products.filter(product => product.category === "electronics") : products

useEffect(()=>{
  localStorage.setItem("cart", JSON.stringify(cartProducts))
},[cartProducts])

useEffect(()=>{
  const getProducts =async() =>{
    try {
      const response = await fetch("https://fakestoreapi.com/products")
      if(!response.ok){
        throw new Error("Failed to fetch data");
        
      }
      setProducts(await response.json())
      
    } catch (error) {
      setErrorMsg(error.message)
    }
    finally{
      setIsLoading(false)
    }
  }
  getProducts()
},[])

const searchFilteredProducts =  searchInput === "" ? filteredProducts : filteredProducts.filter(product =>product.title.toLowerCase().includes(searchInput.toLowerCase())) 

const priceFilterProducts = priceFilter === "low-to-high" ? [...searchFilteredProducts].sort((a,b)=> a.price-b.price) : priceFilter === "high-to-low" ? [...searchFilteredProducts].sort((a,b)=> b.price-a.price) : searchFilteredProducts


  const addToCard =(product) =>{
  const existingCartProduct = cartProducts.find(item => item.id === product.id)
    if(existingCartProduct){
     setCartProducts(
       cartProducts.map(
        item => item.id === product.id ? {...item, quantity: item.quantity + 1} : item
      )
     )
    } 
    else{
      setCartProducts([...cartProducts, {...product, quantity: 1}])
    }
  }

  const delBtn =(product)=>{
    setCartProducts(cartProducts.filter(item=> item.id !== product.id))
  }

  const increaseBtn =(product) =>{
    setCartProducts(
       cartProducts.map(
        item => item.id === product.id ? {...item, quantity: item.quantity + 1} : item
      )
     )
  }
  const decreaseBtn =(product) =>{
    if(product.quantity === 1){
      delBtn(product)
    }
    else{
       setCartProducts(
       cartProducts.map(
        item => item.id === product.id ? {...item, quantity: item.quantity - 1} : item
      )
     )
    }
  }

return(
  <>
  <nav className='product-nav'>
    <div className='products-all-products'>
      <h3 className='Logo'>
        <span>DEE</span><span className='logo-store'>STORE.</span>
      </h3>
      <p className='category-text'>Category</p>
      <select className='all-product-text' name="" id="" onChange={(e)=>setFilter(e.target.value)} >
        <option value= "all">All products</option>
        <option value="men's clothing">men's clothing</option>
        <option value="women's clothing">women's clothing</option>
        <option value="jewelery">jewelery</option>
        <option value="electronics">electronics</option>
      </select>
    </div>
    <div className='cart-container' onClick={() => setShowCart(!showCart)}>
       <button className='cart-button'>SHOPPING_bAG Cart</button>
        <span className='cart-length'>{cartProducts.reduce((total, product) => total + product.quantity, 0)}</span>
    </div>
    </nav>
    {errorMsg && <p>{errorMsg}</p> }
    {isLoading? <p>Loading Product.....</p> : "" }
    <div className='text-display'>
      <p className='discover-text'>DISCOVER YOUR STYLE</p>
      <h2>Find something you'll love.</h2>
      <p>Explore our collection and find your next favorite item.</p>
    </div>
  <div className='search-contianer'>
    <input type="search" name="" id="" placeholder='SeARCH  Search for products...' onChange={(e)=> setSearchInput(e.target.value)} />
    <select name="" id=""  onChange={(e)=> setPriceFilter(e.target.value)}>
      <option value="default-order">Recommended</option>
      <option value="low-to-high">Low to High</option>
      <option value="high-to-low">High to Low</option>
    </select>
  </div>  
   {!isLoading && !errorMsg &&  searchFilteredProducts.length === 0 ?
  <p className='product-unavailable'>No Product Found</p> : ""
}
 <div className='cart-panel'>
   {showCart && ( 
    cartProducts.length === 0 ?
    <div className='cart-items'>
       <div className='cart-close-btn'>
        <h1>Shopping Cart</h1>  
        <button onClick={()=> setShowCart(false)}>close</button>
      </div>
       <h2>Your cart is empty</h2>
      </div>
    :
    <div className='cart-items'>
      <div className='cart-close-btn'>
        <h1>Shopping Cart</h1>  
        <button onClick={()=> setShowCart(false)}>close</button>
      </div>
      {cartProducts.map(product =>
    <div className='cart-product' key={product.id}>
      <p>{product.title} X <span className='quantity'> {product.quantity}</span></p>
       <div>
        <button onClick={()=> increaseBtn(product)}>+</button>
        <button onClick={()=> decreaseBtn(product)}>-</button>
      </div>
      <img src={product.image} alt={product.title} />
      <p>${(product.price * product.quantity).toFixed(2)} </p>
      <button onClick={()=> delBtn(product)}>Del</button>
    </div>
    )
      }
      <h2>
       total: ${cartProducts.reduce((total, product)=> total + (product.price * product.quantity), 0).toFixed(2)} 
      </h2>
    </div>
    )}
 </div>
 <div className='our-products'> 
  <h3>Our Products</h3> 
  <p>{priceFilterProducts.length} products</p>
 </div>
  <div className='products-container'>  
    {priceFilterProducts.map(product =>
  <div className='product-info' key={product.id}>
  <img
    className='product-image'
    src={product.image}
    alt={product.title}
  />
  <h3 className='product-category'>{product.category.toUpperCase()}</h3>
  <h4 className='product-title'>{product.title}</h4>
  <p className='rating'>⭐ {product.rating.rate} <span>({product.rating.count} reviews)</span></p>

  <div className='price-cart'>
    <p className='product-price'>${product.price.toFixed(2)}</p>
    <button onClick={() => addToCard(product)}>
      Add to cart
    </button>
  </div>
</div>
    )}
  </div>  
 
  </>
)

}

export default App
