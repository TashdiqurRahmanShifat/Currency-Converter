const baseURL = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies`;

let dropDowns=document.querySelectorAll(".dropDown select");
let amount=document.querySelector(".amount input");
let msg=document.querySelector(".msg");
let btn=document.querySelector(".btn");
let fromCurrency="",toCurrency="";

for(let dropDown of dropDowns)//From & To Select
{
    for(let currencyOption in countryList)
    {
        let option=document.createElement("option");
        option.innerText=currencyOption;//Create option for dropdown.Here option is country name
        dropDown.append(option);//Append option to each dropdown(from and to)
        if(dropDown.name==="from" && currencyOption==="USD")
        {
            option.selected="selected";
            fromCurrency=currencyOption.toString().toLowerCase();
        }

        if(dropDown.name==="to" && currencyOption==="BDT")
        {
            option.selected="selected";
            toCurrency=currencyOption.toString().toLowerCase();
        }
 
    }


    //"click"	When any element inside dropDown is clicked (including <select>, <option>, <i>, etc.)
    //"change"	When a new option is selected in a <select> dropdown

    dropDown.addEventListener("change",(selectedCurrency)=>{
        if(dropDown.name==="from")fromCurrency=selectedCurrency.target.value;
        else if(dropDown.name==="to")toCurrency=selectedCurrency.target.value;
        updateFlag(selectedCurrency.target);//dropDown container has multiple child elements like <select>, <option>, <img>, and <i>. 
        //By clicking on any of them, selectedCurrency.target will reference the exact element that was clicked.
        console.log("drop",fromCurrency);
        msg.innerText="";
        amount.value="";
    })
}



const updateFlag=(selectedCurrency)=>{
    let currency=selectedCurrency.value;
    fromCurrency=fromCurrency.toString().toLowerCase();
    toCurrency=toCurrency.toString().toLowerCase();
    let country=countryList[currency];
    let newImgSrc=`https://flagsapi.com/${country}/flat/64.png`;
    //console.log(selectedCurrency);//<select name="from">...</select>
    //console.log(selectedCurrency.parentElement);//Select-container
    let img=selectedCurrency.parentElement.querySelector("img");
    img.src=newImgSrc;
}


async function getURL(resolve,reject)
{
    try 
    {
        let URL = `${baseURL}/${fromCurrency}.json`; 
        let response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`Status : ${response.status}\n Status Text : ${response.statusText}`);
        }
        let responseJSON = await response.json();
        let rate = responseJSON[fromCurrency][toCurrency];
        let enteredAmount=parseFloat(amount.value);
        if(isNaN(enteredAmount)||enteredAmount<=0) 
        {
            msg.innerText="";
            amount.value="";
            alert("Enter digit greater than 0");
            return;
            
        }
        let totalAmount=rate*enteredAmount;
        totalAmount=parseFloat(totalAmount.toFixed(2));
        msg.innerText=`${enteredAmount} ${fromCurrency.toUpperCase()}=${totalAmount} ${toCurrency.toUpperCase()}`;
    } 
    catch (error) 
    {
        msg.innerHTML = `Failed to fetch exchange rate. Please try again later.`;
        console.error("Fetch error:", error);
        return;
    }
}


btn.addEventListener("click",(e)=>{
    e.preventDefault();
    getURL();
})