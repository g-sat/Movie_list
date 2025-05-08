import React from 'react'
import { createContext, useState, useContext, useEffect } from 'react'

const MovieContext = createContext()

export const useMovieContext = () => useContext(MovieContext)

export const MovieProvider = ({children}) => {
    const [favorites, setFavourites] = useState([])

    useEffect(()=>{
        const storedFavs = localStorage.getItem("favourites")
        if(storedFavs) setFavourites(JSON.parse(storedFavs))
    }, [])

    useEffect(()=>{
        localStorage.setItem('favourites',JSON.stringify(favorites))
    },[favorites])
     
    const addToFavorites = (movie) =>{
        setFavourites(prev => [...prev, movie])
    }

    const removeFrormFavorites = (movieId) =>{
        setFavourites(prev => prev.filter(movie => movie.id !== movieId))
    }

    const isFavorite = (movieId) => {
        return favorites.some(movie => movie.id ===movieId)
    }

    const value = {
        favorites,
        addToFavorites, 
        removeFrormFavorites, 
        isFavorite
    }
    return <MovieContext.Provider value={value}>
        {children}
    </MovieContext.Provider>
}
