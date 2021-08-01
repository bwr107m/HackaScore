import React, { useState, useEffect } from "react";
import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { NodeService, todoObject } from "../service/nodeService";
import { Password } from 'primereact/password';
import './Login.css';
import { default as swal } from 'sweetalert2'
import logo from './tsmc.svg';


function LoginApp() {
    const [todolist, setTodolist] = useState<Array<todoObject>>([]);
    const [addAccount, setAddAccount] = useState<string>("");
    const [addPassword, setAddPassword] = useState<string>("");
    const nodeService = new NodeService();


    async function submitLoginData() {
        //await postData();
        //getData();
        let loginData = await nodeService.getLoginData(addAccount , addPassword);
        if(loginData.msg === "login success!")
        {
            //swal.fire('登入成功！',loginData.msg,'success')
            window.location.href = "/DataTableSelection?account="+addAccount+" & password="+addPassword+""// + loginData._id
        }
        else
        {
            swal.fire('登入失敗！',loginData.msg,'error')
        }


        
        //nodeService.getTodoData().then((data) => setTodolist(data));
    }


    return (
            <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <div className="input-container">
            <h4>Username:</h4>
            <InputText
                id="inputAccount"
                value={addAccount}
                placeholder="Username"
                onChange={(e) => setAddAccount(e.target.value)}
            />
            </div>
            <div className="input-container">
            <h4>Password:</h4>
            <Password 
                id="inputPassword"
                value={addPassword}
                placeholder="Password"
                onChange={(e) => setAddPassword(e.target.value)} 
                feedback={false} 
            />
            </div>
            <Button id="btnSubmit" label="Log in" onClick={submitLoginData} className="paddingWithTop1pp"/>
            <div>
                <a href="#" className="link forgotten-password">
                    Forgot password?
                </a>
            </div>
            </header>
            
    );
}

export default LoginApp;
