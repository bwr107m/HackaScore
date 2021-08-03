import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/saga-blue/theme.css';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import { useParams } from "react-router-dom";
import { useCookies } from 'react-cookie';
import React, { useEffect, useState } from 'react';

import HeaderBar from './HeaderBar';
import gradesServer from '../server/Server';
import DataTableSelection from './DataTableSelection';

const GeneralGradeForm = () => {
    let emptyGrade: any = {
        comment: ''
    };

    // const params: any = useParams();
    // const userName = params.username;
    const [cookies, setCookie] = useCookies(['username']);
    const userName = cookies.username;
    const userId = userName.substring(5);
    const titleList = ['rank', 'name', 'topic'];
    const scoreList = [
        ['maintain', '\n( 15% )'],
        ['innov', '\n( 15% )'],
        ['design', '\n( 35% )'],
        ['skill', '\n( 20% )'],
        ['demo', '\n( 15% )'],
        ['result', '']
    ];
    const showCommentLogo = ['pi-comments', 'p-button-warning'];

    const [grades, setGrades] = useState([]);
    const [grade, setGrade] = useState(emptyGrade);
    const [commentDialog, setCommentDialog] = useState(false);

    useEffect(() => {
        const gradeServer = new gradesServer();
        gradeServer.getGeneralGradeForm().then((data) => setGrades(data));        
    }, []);

    const showCommentDialog = (grade: any) => {
        setGrade({ ...grade });
        setCommentDialog(true);
    };

    const hideDialog = () => {
        setCommentDialog(false);
    };

    const editDialogFooter = (
        <React.Fragment>
            <Button label='Close' icon='pi pi-reply' className='p-button-text' onClick={hideDialog} />            
        </React.Fragment>
    );

    return (
        <div className='card'>
            <HeaderBar userName={userName} setGrades={setGrades} isDoneSubmit={true} />
            <DataTableSelection
                titleList={titleList}
                scoreList={scoreList}
                grades={grades}
                dialog={showCommentDialog}
                dialogLogo={showCommentLogo}
            />

            <Dialog
                header='Comments'
                visible={commentDialog}
                footer={editDialogFooter}
                style={{ width: '450px' }}
                className="p-fluid"
                onHide={hideDialog}
                modal
            >
                <div className='field'>                    
                    <label>{grade.comment}</label>                    
                </div>
            </Dialog>
        </div>
    );
};

export default GeneralGradeForm;