const puppeteer = require('puppeteer');
const codes=require("./codes.js")
const loginLink = 'https://www.hackerrank.com/auth/login';
const email='sidemption007@gmail.com'
const password='strongpassword'

let broswerOpen = puppeteer.launch({   // will open chromium
    headless:false,   //browser visible krne k liye
    // args: ['--start-fullscreen']
    // args
    args: ['--start-maximized'],     
    defaultViewport: null   
    
});  //; here is redundant

let page= 

broswerOpen.then(function(browserObj){
    let broswerOpenPromise=browserObj.newPage()
    return broswerOpenPromise;
}).then(function(newTab){
    page = newTab
    let hackerRankOpenPromise=newTab.goto(loginLink)
    return hackerRankOpenPromise
}).then(function(){
    let emailIsEntered=page.type("input[id='input-1']" , email , {delay : 5} )
    return emailIsEntered
}).then(function(){
    let passwordIsEntered=page.type("input[type='password']" , password , {delay : 5} )
    return passwordIsEntered
}).then(function(){
    let loginButtonClicked=page.click("button[data-analytics='LoginPassword']", {delay:5})
    return loginButtonClicked
}).then(function(){ //ye wala function bina waitAndClick use krne se pta h kya ho rha h? login aur sumit krne ke bad it's unable to find the element instantly and shows up the error 'no element found for selector: a[data-attr1='algorithms'] cuz instantly to load hi nhi ho rha to iss selector wala element load hi nhi hua to milega kaise. so instead, by using waitAndClick, we wait for a certain selector ke element ko load hone ka and then aage ka function run ho
    // let algorithmsSelected=page.click("a[data-attr1='algorithms']",{delay:30})
    let clickOnAlgoPromise=waitAndClick("a[data-attr1='algorithms']",page)
    return clickOnAlgoPromise
}).then(function(){
    let clickWarmup=waitAndClick("input[value='warmup']",page)
    return clickWarmup
}).then(function(){
    // let waitfor2seconds=page.waitFor(2000)   //THIS SHOWED UP ERROR CUZ: https://github.com/puppeteer/puppeteer/issues/6214
    let waitfor2seconds=page.waitForTimeout(2000)
    return waitfor2seconds
}).then(function(){
    // let allChallengesPromise=page.click("button['.ui-btn.ui-btn-normal.primary-cta.ui-btn-primary.ui-btn-styled']",{delay:30})
    let allChallengesPromise=page.$$('.ui-btn.ui-btn-normal.primary-cta.ui-btn-line-primary.ui-btn-styled',page)
    return allChallengesPromise
}).then(function(questionsArr){
    console.log('number of questions: ',questionsArr.length)    //prints number of warmup questions in algo section
    let questionWillBeSolved=questionSolver(page,questionsArr[0],codes.answers[0])
    return questionWillBeSolved
})



function waitAndClick(selector,cPage){  //this function ensures that pehle wait krein hum kisi page ke load ho jane mein, kyuki page k element ko point out r rhe hain using selector etc.,, wo hoga to tab hi na jab wo load hoga to begin with
    return new Promise(function(resolve,reject){
        let waitForModelPromise=cPage.waitForSelector(selector)
        waitForModelPromise.then(function(){
            let clickModel=cPage.click(selector)
            return clickModel
        }).then(function(){
            resolve()
        }).catch(function(err){
            reject()
        })
    })
}

function questionSolver(page,question,answer){
    return new Promise(function(resolve,reeject){
        let questionWillBeClicked=question.click()
        // return questionWillBeClicked
        questionWillBeClicked.then(function(){
            let EditorInFocusPromise=waitAndClick('.monaco-editor.no-user-select.vs',page)
            return EditorInFocusPromise
        }).then(function(){
            return waitAndClick('.checkbox-input',page)
        }).then(function(){
            return page.waitForSelector("textarea.custominput")
        }).then(function(){
            return page.type('textarea.custominput',answer,{delay:10})
        }).then(function(){
            let ctrlIsPressed=page.keyboard.down('Control') //automates pressing control key
            return ctrlIsPressed
        }).then(function(){
            let Aispressed=page.keyboard.press('A',{delay:10})  //An example of pressing A
            // await page.keyboard.down('Shift');
            // await page.keyboard.press('KeyA');
            // await page.keyboard.up('Shift');
            // so basically .down is for continued pressing of a keyboard while .press means 1 time press
            return Aispressed
        }).then(function(){
            let Xispressed=page.keyboard.press('X',{delay:20})
            return Xispressed
        }).then(function(){
            let ctrlUnpress=page.keyboard.up('Control')
            return ctrlUnpress
        }).then(function(){
            let mainEditorInFocus=waitAndClick('.monaco-editor.no-user-select.vs',page)
            return mainEditorInFocus
        }).then(function(){
            let ctrlIsPressed=page.keyboard.down('Control')
            return ctrlIsPressed
        }).then(function(){
            let Aispressed=page.keyboard.press('A')
            return Aispressed
        }).then(function(){
            let vIsPressed=page.keyboard.press('V')
            return vIsPressed
        }).then(function(){
            let ctrlUnpress=page.keyboard.up('Control')
            return ctrlUnpress
        }).then(function(){
            let submitCode=page.click("button.ui-btn.ui-btn-normal.ui-btn-primary.pull-right.hr-monaco-submit.ui-btn-styled",{delay:30})
            return submitCode
        }).then(function(){
            resolve()
        }).catch(function(err){
            reject()
        })
    })
}










