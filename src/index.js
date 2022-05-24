import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './styles/App.css'

let dataList = []

function ListItem(props){
  const {Customer, 
    Building, 
    BuildingType, 
    Area, BuildingYear, 
    Electricity2019, 
    Electricity2020, 
    Heating2019, 
    Heating2020} = props.item

  return <li className='listItem'>
    <div className='building-card'>
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
      <div className='column'>
        <h3>Mätningar</h3>
        <ul>
          <li>Elen 2019: {Electricity2019} kWh</li>
          <li>Elen 2020: {Electricity2020} kWh</li>
          <li>Värme 2019 {Heating2019} kWh</li>
          <li>Värme 2020 {Heating2020} kWh</li>
        </ul>
      </div>

    </div>

  </li>
}

function CardLayoutInputs(props){

  const searchField = React.createRef();
  const radioOffice = React.createRef();
  const radioHouse = React.createRef();
  const areaRange = React.createRef();
  const [rangeValue, setRangeValue] = useState(0)

  // if(props.list){
  //   console.log(props.list)
  //   const maxValue = Math.max(...props.list.map(item => item.Area))
  //   areaRange.current.max = maxValue

  // }
    
  useEffect(() =>{
    const maxValue = Math.max(...dataList.map(item => item.Area))
    areaRange.current.max = maxValue
  })

  const searchInputs = ()=>{
    const searchText = searchField.current.value.toLowerCase();

    const radioInput = document.querySelectorAll('input[type="checkbox"]:checked')[0];

    const radioValue = radioInput ? radioInput.value : ''

    setRangeValue(areaRange.current.value)
    areaRange.current.value = rangeValue
    console.log(rangeValue)


    props.setData(dataList.filter(item => item.Building.toLowerCase().includes(searchText) &&
     item.BuildingType.includes(radioValue) && 
     item.Area < areaRange.current.value     
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

function CardLayout(){
  const [data, setData] = useState([]);


  useEffect(()=>{
    (async ()=>{
      dataList = await fetchData('./json/testData.json')
      setData(dataList)
    })();
  }, [])
  return <div>
      <CardLayoutInputs list={data} setData={setData}/>
    <div className='cards-container'>
      <ul className='card-list'>
        {data &&  data.length > 0 && data.map((item) => <ListItem key={item.Id.toString()} item={item} />)}
      </ul>
    </div>
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

app.render(<CardLayout />);

