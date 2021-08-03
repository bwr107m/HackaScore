import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/saga-blue/theme.css';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';

import { useParams } from "react-router-dom";
import { useCookies } from 'react-cookie';
import React, { useEffect, useState } from 'react';

import HeaderBar from './HeaderBar';
import gradesServer from '../server/Server';
import DataTableSelection from './DataTableSelection';

const PersonalGradeForm = () => {    
    let emptyGrade: any = {        
        maintain: 0,
        innov: 0,
        design: 0,
        skill: 0,
        demo: 0,
        result: 0,
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
        ['result', ''],
    ];
    const editGradeLogo = ['pi-pencil', 'p-button-success'];

    const [grades, setGrades] = useState([]);
    const [grade, setGrade] = useState(emptyGrade);
    const [gradeDialog, setGradetDialog] = useState(false);

    useEffect(() => {
        const gradeServer = new gradesServer();
        gradeServer.getPersonalGradeForm(userId).then((data) => setGrades(data));        
    }, []);

    const editGradeDialog = (grade: any) => {
        setGrade({ ...grade });
        setGradetDialog(true);
    };

    const hideDialog = () => {
        setGradetDialog(false);
    };

    const saveGrade = () => {
        const gradeServer = new gradesServer();
        gradeServer.updateGradeForm(grade.teamId, grade.judgeId, grade).then((data) => setGrades(data));

        setGrade(emptyGrade);
        setGradetDialog(false);
    };

    const onInputNumberChange = (e: any, type: string) => {
        const val = e.value || 0;
        let _grade: any = { ...grade };
        _grade[`${type}`] = val;

        setGrade(_grade);
    };

    const onInputTextareaChange = (e: any, type: string) => {
        const val = (e.target && e.target.value) || '';
        let _grade: any = { ...grade };
        _grade[`${type}`] = val;

        setGrade(_grade);
    };

    const editDialogFooter = (
        <React.Fragment>
            <Button label='Cancel' icon='pi pi-times' className='p-button-text' onClick={hideDialog} />
            <Button label='Save' icon='pi pi-check' className='p-button-text' onClick={saveGrade} />
        </React.Fragment>
    );

    return (
        <div className='card'>
            <HeaderBar userName={userName} setGrades={setGrades} isDoneSubmit={false} />
            <DataTableSelection
                titleList={titleList}
                scoreList={scoreList}
                grades={grades}
                dialog={editGradeDialog}
                dialogLogo={editGradeLogo}
            />

            <Dialog
                header='Grade Details'
                visible={gradeDialog}
                footer={editDialogFooter}
                style={{ width: '450px' }}
                className='p-fluid'
                onHide={hideDialog}
                modal
            >
                <div className='formgrid grid'>
                    {scoreList.slice(0, 5).map((item) => (
                        <div className='field col-4'>
                            <label htmlFor={item[0]}>{item[0].substr(0, 1).toUpperCase() + item[0].substr(1)}</label>
                            <InputNumber
                                value={grade[`${item[0]}`]}
                                onValueChange={(e) => onInputNumberChange(e, item[0])}
                            />
                        </div>
                    ))}
                </div>

                <div className='field'>
                    <label htmlFor='comment'>Comment</label>
                    <InputTextarea
                        value={grade.comment}
                        onChange={(e) => onInputTextareaChange(e, 'comment')}
                        rows={3}
                        cols={20}
                    />
                </div>
            </Dialog>
        </div>
    );
};

export default PersonalGradeForm;