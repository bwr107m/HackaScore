import { Menubar } from 'primereact/menubar';

import gradesServer from '../server/Server';

//props: {userName, setGrades, isDoneSubmit}
const HeaderBar = (props: any) => {    
    const userName = props.userName;
    const userId = userName.substring(5);

    const turnToPersonalPage = () => {
        //跳轉個人評分頁面 => PersonalGradeForm
        window.location.href = `/PersonalGradeForm/${userName}`
    }

    const turnToGeneralPage = () => {
        //跳轉總成績頁面 => GeneralGradeForm
        window.location.href = `/GeneralGradeForm/${userName}`
    }

    const updateUserAuthority = () => {
        const gradeServer = new gradesServer();
        gradeServer.updateUserAuthority(userId).then((data) => props.setGrades(data));
    }
    
    const menubar = [
        {
            label: `User: ${userName}`,
            icon: 'pi pi-fw pi-user-edit',
            items: [
                {
                    label: 'Personal',
                    icon: 'pi pi-fw pi-user',
                    command: turnToPersonalPage
                }, {
                    label: 'General',
                    icon: 'pi pi-fw pi-users',
                    command: turnToGeneralPage
                }, {
                    separator: true
                }, {
                    label: 'Submit',
                    icon: 'pi pi-fw pi-upload',
                    disabled: props.isDoneSubmit,
                    command: updateUserAuthority
                }
            ]
        }
    ];

    return(
        <Menubar model={menubar} />
    );
}

export default HeaderBar;