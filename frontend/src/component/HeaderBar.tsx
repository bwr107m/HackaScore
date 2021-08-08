import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Menubar } from 'primereact/menubar'

import { useCookies } from 'react-cookie'
import React, { useState } from 'react'

import gradesServer from '../server/Server'

//props: {grades, setGrades, isDoneSubmit}
const HeaderBar = (props: any) => {
  const [cookies, setCookie] = useCookies(['username'])
  const userName = cookies.username
  const userId = userName.substring(5)

  const [isDoneDialog, setIsDoneDialog] = useState(false)
  const [submitDialog, setSubmitDialog] = useState(false)

  const turnToLoginPage = () => {
    window.location.href = '/'
    localStorage.removeItem("user")
    cookies.remove('username')
  }

  const turnToPersonalPage = () => {
    window.location.href = '/PersonalGradeForm'
  }

  const turnToGeneralPage = () => {
    window.location.href = '/GeneralGradeForm'
  }

  const hideDialog = () => {
    setIsDoneDialog(false)
    setSubmitDialog(false)
  }

  const updateUserAuthority = () => {
    const gradeServer = new gradesServer()
    gradeServer.updateUserAuthority(userId).then((data) => props.setGrades(data))

    setSubmitDialog(false)
  }

  const checkDoneSubmit = () => {
    let index = props.grades.find((item: { result: number }) => item.result === 0) //判斷分數是否填滿
    if (index) setIsDoneDialog(true)
    //是 => 送出視窗
    else setSubmitDialog(true) //否 => 提醒視窗
  }

  const menubar = [
    {
      label: `User: ${userName}`,
      icon: 'pi pi-fw pi-user',
      items: [
        {
          label: 'Sign Out',
          icon: 'pi pi-fw pi-sign-out',
          command: turnToLoginPage,
        },
      ],
    },
    {
      label: 'Personal',
      icon: 'pi pi-fw pi-user-edit',
      command: turnToPersonalPage,
    },
    {
      label: 'General',
      icon: 'pi pi-fw pi-users',
      command: turnToGeneralPage,
    },
    {
      label: 'Submit',
      icon: 'pi pi-fw pi-upload',
      disabled: props.isDoneSubmit,
      command: checkDoneSubmit,
    },
  ]

  const submitDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button
        label="Confirm"
        icon="pi pi-check"
        className="p-button-text"
        onClick={updateUserAuthority}
      />
    </React.Fragment>
  )

  const isDoneDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
    </React.Fragment>
  )

  return (
    <div>
      <Menubar model={menubar} />

      <Dialog
        header="Are you sure ?"
        visible={submitDialog}
        footer={submitDialogFooter}
        style={{ width: '450px' }}
        className="p-fluid"
        onHide={hideDialog}
        modal
      >
        <div>
          <label>You won't be able to modify grades !</label>
        </div>
      </Dialog>

      <Dialog
        header="Error"
        visible={isDoneDialog}
        footer={isDoneDialogFooter}
        style={{ width: '450px' }}
        className="p-fluid"
        onHide={hideDialog}
        modal
      >
        <div>
          <label>還有隊伍尚未評分！</label>
        </div>
      </Dialog>
    </div>
  )
}

export default HeaderBar
