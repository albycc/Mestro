import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './styles/App.css'

let dataList = []

function CardItem(props){
  const {Customer, 
    Building, 
    BuildingType, 
    Area, BuildingYear, 
    Electricity2019, 
    Electricity2020, 
    Heating2019, 
    Heating2020} = props.item

  return <div className='building-card'>
    <div className='row'>
      <div className='title-container'>
        <h2>{Building}</h2>
        <span>{Customer}</span>
      </div>
    </div>
    <div className='row'>
      <span>{BuildingType}</span>
      <span>{Area} m<sup>2</sup></span>
      <span>{BuildingYear || 'Okänt årtal'}</span>
    </div>
    <div className='measures-column'>
      <h3 className='center'>Mätningar</h3>
      <div className='row center'>
        <div className='column'>
          <p className='subheading'>El</p>
          <ul className='measures-list'>
            <li><b>2019:</b> {Electricity2019} kWh</li>
            <li><b>2020:</b> {Electricity2020} kWh</li>
          </ul>
        </div>
        <div className='column'>
          <p className='subheading'>Värme</p>
          <ul className='measures-list'>
            <li><b>2019:</b> {Heating2019} kWh</li>
            <li><b>2020:</b> {Heating2020} kWh</li>
          </ul>

        </div>

      </div>
    </div>

  </div>

}

function CardLayoutInputs(props){

  const searchField = React.createRef();
  const radioOffice = React.createRef();
  const radioHouse = React.createRef();
  const areaRange = React.createRef();
  const [rangeValue, setRangeValue] = useState(0)
    
  useEffect(() =>{
    if(props.list.length > 0){
      const maxValue = Math.max(...dataList.map(item => item.Area))
      areaRange.current.max = maxValue
      areaRange.current.defaultValue = maxValue
      setRangeValue(areaRange.current.value)
    }
  })

  const searchInputs = ()=>{
    const searchText = searchField.current.value.toLowerCase();

    const radioInput = document.querySelectorAll('input[type="checkbox"]:checked')[0];

    const radioValue = radioInput ? radioInput.value : ''

    setRangeValue(areaRange.current.value)

    props.setData(dataList.filter(item => item.Building.toLowerCase().includes(searchText) &&
     item.BuildingType.includes(radioValue) && 
     item.Area <= rangeValue     
     ))
  }

  const radioButton = (e) =>{
    const radio =  e.target;
    radio.id === radioOffice.current.id ? radioHouse.current.checked = false : radioOffice.current.checked = false;
  }

  return <div className='cardlayout-inputs-container'>
    <ul className='input-row'>
      <li>
        <input type="text" onChange={e => searchInputs(e)} ref={searchField} placeholder='Sök byggnader...'/>
      </li>
      <li>
          <input 
            type="checkbox" 
            name="building-type" 
            id="radio-kontor" 
            value="Kontor"
            ref={radioOffice}
            onClick={radioButton}
            onChange={searchInputs}
          />
        <label htmlFor="radio-kontor">
          Kontor
        </label>
      </li>
      <li>
          <input 
            type="checkbox" 
            name="building-type" 
            id="radio-flerbostadshus" 
            value="Flerbostadshus"
            ref={radioHouse}
            onClick={radioButton}
            onChange={searchInputs}/>
        <label htmlFor="radio-flerbostadshus">
          Flerbostadshus
        </label>
      </li>
      <li>
        <label>
          Area(m<sup>2</sup>)
        </label>
          <input 
            type="range" 
            min="0"
            ref={areaRange} 
            onChange={searchInputs}
            />
          <span className="value-label">{rangeValue}</span>
      </li>
    </ul>
  </div>
}

function CardLayout(props){

  return <div className='cards-layout'>
      <div className='card-container'>
        {props.list &&  props.list.length > 0 ? 
          <div className='cards-list'>
            {props.list.map((item) => <CardItem key={item.Id.toString()} item={item} />)}
          </div> :
          <div className="search-result-message"><h1>Inga resultat</h1></div>
          }
        </div>
      </div>
}

function CardContainer(){
  const [data, setData] = useState([]);

  useEffect(()=>{
    (async ()=>{
      dataList = await fetchData('./json/testData.json')
      setData(dataList)
    })();
  }, [])


  return <div>
    <CardLayoutInputs list={data} setData={setData}/>
    <CardLayout list={data} setData={setData} />
  </div>
}

async function fetchData(list){
  const response = await fetch(list, {
    headers : { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
     }
  });

  const data = await response.json();
  return data
}


const app = ReactDOM.createRoot(document.getElementById('app-container'));

app.render(<CardContainer />);

