import React, { useState, useEffect } from "react";
import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { NodeService, todoObject } from "./service/nodeService";
import { Password } from 'primereact/password';
import './App.css';
import { default as swal } from 'sweetalert2'


function LoginApp() {
    const [todolist, setTodolist] = useState<Array<todoObject>>([]);
    const [addAccount, setAddAccount] = useState<string>("");
    const [addPassword, setAddPassword] = useState<string>("");
    const nodeService = new NodeService();


    async function submitLoginData() {
        //await postData();
        //getData();
        let response = await nodeService.getLoginData(addAccount , addPassword);
        if(response.msg === "login success!"){
            swal.fire('登入成功！',response.msg,'success')
        }
        else{
            swal.fire('帳號或密碼錯誤！',response.msg,'error')
        }


        
        //nodeService.getTodoData().then((data) => setTodolist(data));
    }


    return (
        <div className="App  default-font">
            <header className="App-header">
            <h6>Account</h6>
            <InputText
                id="inputAccount"
                value={addAccount}
                onChange={(e) => setAddAccount(e.target.value)}
            />
            <h6>Password</h6>
            <Password 
                id="inputPassword"
                value={addPassword} 
                onChange={(e) => setAddPassword(e.target.value)} 
                feedback={false} 
            />

            <br></br>
            <Button id="btnSubmit" label="Log in" onClick={submitLoginData} className="paddingWithTop1pp"/>
            <br></br>

            <div className="fontSize13px">
                Don’t have an account? <a href="" className="App-link">Sign up</a>    
            </div>

            </header>
            
        </div>
    );
}

export default LoginApp;
