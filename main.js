const http = require("http");
const fsPromises = require("fs/promises")
const fs = require("fs")
const url = require("url");
const dirname  = require("path");

const dataText = fs.readFileSync(`${__dirname}/data.json`);
const data = JSON.parse(dataText);

const app = http.createServer( async (req, res) => {
    res.writeHead(200, {
        "Content-Type":"text/html"
    });

    const {query, pathname} = url.parse(req.url, true);

    switch(pathname) {
        case "/" : {
            const bf = await fsPromises.readFile(`${__dirname}/Pages/homepage.html`)
            res.end(bf)
            break;
        }

        case "/products": {
            const bf = await fsPromises.readFile(`${__dirname}/Pages/products.html`)
            let text = bf.toString();
            let productText = "";

            for(let i = 0; i < data.length; i++) {
                productText += `
                <div class = "product-card">
                <img src = "${data[i].thumbnail}" alt = "product-image" height = "250px"/>
                <h3>${data[i].title}</h3>
                <p>${data[i].description}
                <a href = "/view?id=${data[i].id}" target = "_blank">More</a>
                </div>
                `
            }

            text = text.replace("moidkhan", productText);
            res.end(text);
            break;
        }

        case "/view" : {
            const bf = await fsPromises.readFile("./Pages/detail.html")
            let text = bf.toString();

            const newData = data.find((data) => {
                if(data.id == query.id) return true
                else return false
            });

            text = text.replace("hello", 
                `
                <div class = "product-card">
                    <div class = "img-container">
                        <img src = "${newData.thumbnail}" alt = "product-image" height = "250px"/>
                    </div>

                    <div class = detail-container>
                        <h3>${newData.title}</h3>
                        <p>${newData.description}</p>
                        <p>Rating : ${newData.rating}</p>
                        <p>Price : $ ${newData.price}</p>
                    </div>
                </div>
                `
            );

            res.end(text);
            break;
        }


        default : {
            res.end(`<h2>Oops! Page not found</h2>`)
        }
    }
})

app.listen(2300, () => {
    console.log("------- Server Listening at 2300 --------");
})