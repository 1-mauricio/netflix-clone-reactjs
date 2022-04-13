import React, { useEffect, useState } from "react";
import "./App.css";
import Tmdb from "./Tmdb";
import MovieRow from "./components/MovieRow";
import FeatureMovie from "./components/FeatureMovie";
import Header from "./components/Header";

export default function App() {
    const [movieList, setMovieList] = React.useState([]);
    const [featureData, setFeatureData] = React.useState(null);
    const [blackHeader, setBlackHeader] = React.useState(false);

    useEffect(() => {
        const loadAll = async () => {
            //pegando a lista total
            let list = await Tmdb.getHomeList();
            setMovieList(list);

            // pegando o featured
            let originals = list.filter((item) => item.slug === "originals");
            let random = Math.floor(
                Math.random() * (originals[0].items.results.length - 1)
            );
            let randomMovie = originals[0].items.results[random];
            let randomMovieData = await Tmdb.getMovieInfo(randomMovie.id, "tv");
            setFeatureData(randomMovieData);
        };
        loadAll();
    }, []);

    useEffect(() => {
        const scrollListener = () => {
            if (window.scrollY > 10) {
                setBlackHeader(true);
            } else {
                setBlackHeader(false);
            }
        };

        window.addEventListener("scroll", scrollListener);

        return () => {
            window.removeEventListener("scroll", scrollListener);
        };
    }, []);

    return (
        <div className="page">
            <Header black={blackHeader} />
            {featureData && <FeatureMovie item={featureData} />}
            <section className="lists">
                {movieList.map((item, key) => (
                    <MovieRow key={key} title={item.title} items={item.items} />
                ))}
            </section>

            <footer>
                Feito com{" "}
                <span role="img" aria-label="coração">
                    ❤️
                </span>
                <br />
                Direitos de imagem para Netflix
                <br />
                Dados de filmes e séries de TV do TMDb
            </footer>

            
            <div className="loading">
                Loading
            </div>
        </div>
    );
}
