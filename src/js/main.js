const apiKey = "geQC2QdmrzdQyRXa2Q1XovTHoRPxfwazqcjIaZB2";
const txt_fecha = document.getElementById("txt_fecha")
const btnBuscar = document.getElementById("btnBuscar")
const asteroidesPeligrosos = document.getElementById("asteroides")
const mensajeAlerta = document.getElementById("mensajeAlerta")
let listaAsteroides = []

async function obtenerAsteroides()
{
    let response = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${txt_fecha.value}&end_date=${txt_fecha.value}&api_key=${apiKey}`);
    let responseJson = await response.json()
    listaAsteroides = []
    Object.keys(responseJson.near_earth_objects).forEach(objecto =>{
            let fecha = responseJson.near_earth_objects[objecto]
            fecha.forEach(asteroides =>{
                    if(asteroides.is_potentially_hazardous_asteroid==true)
                    {
                        let asteroide = []
                        asteroide.push(asteroides.name)
                        asteroide.push(asteroides.close_approach_data[0].close_approach_date_full)
                        asteroide.push(asteroides.estimated_diameter.kilometers.estimated_diameter_max)
                        asteroide.push(asteroides.estimated_diameter.kilometers.estimated_diameter_min)
                        listaAsteroides.push(asteroide)
                    }
                });
    });

    Mostrar()
}

function Mostrar()
{
    asteroidesPeligrosos.innerHTML = ""
    if(listaAsteroides.length>0)
    {
        for(let i = 0; i < listaAsteroides.length;i++)
        {
            let dia = new Date(listaAsteroides[i][1])
            let options = {weekday: "long", year: "numeric", month: "long", day: "numeric"};
            asteroidesPeligrosos.innerHTML += ` <div class="card" style="background-color: #adffffcc;">
                                        <div class="card-body">
                                            <h5 class="card-title"> Asteroide ${listaAsteroides[i][0]}</h5>
                                            <p class="card-text">Tiene un diametro maximo de ${listaAsteroides[i][2]} km y minimo de 
                                            ${listaAsteroides[i][3]} km. Con fecha de aproximacion para el 
                                            ${dia.toLocaleDateString("es-ES", options)} a las ${dia.toLocaleTimeString()}</p>
                                        </div>
                                      </div>`
        }
    }
    else
    {
        asteroidesPeligrosos.innerHTML = `<div class="contenedor_asteroides">
                                                <p class="letraAsteroide">No se encontraron asterorides peligrosos para esa fecha</p>
                                           </div>`
    }
}


function validar()
{
    if(txt_fecha.value == "")
    {
        mensajeAlerta.innerText = "Debe ingresar una fecha";
        mensajeAlerta.classList.add("textoMensajeAlert");
    }
    else
    {
        mensajeAlerta.innerText = "";
        mensajeAlerta.classList.remove("textoMensajeAlert");
        asteroidesPeligrosos.innerHTML = `  <div id="contenedor_carga"> 
                                                <div id="carga"></div>
                                            </div>`
        obtenerAsteroides();
    }
}

btnBuscar.addEventListener("click", validar)