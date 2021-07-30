import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/saga-blue/theme.css';

import { Row } from 'primereact/row';
import { Knob } from 'primereact/knob';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Menubar } from 'primereact/menubar';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { ColumnGroup } from 'primereact/columngroup';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';

import './DataTable.css';
import gradesServer from '../server/Server';
import React, { useEffect, useState, useRef } from 'react';

const DataTableSelection = () => {
    let emptyGrade: any = {
        _id: null,
        rank: 1,
        name: '',
        topic: '',
        maintain: 0,
        innov: 0,
        design: 0,
        skill: 0,
        demo: 0,
        result: 0,
        comment: '',
        judgeId: '',
        complete: false
    };
    const titleList = ['rank', 'name', 'topic'];
    const scoreList = [['maintain', '\n( 15% )'], ['innov', '\n( 15% )'], ['design', '\n( 35% )'], ['skill', '\n( 20% )'], ['demo', '\n( 15% )'], ['result', '']];

    const [grades, setGrades] = useState([]);
    const [grade, setGrade] = useState(emptyGrade);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(String);
    const [gradeDialog, setGradetDialog] = useState(false);

    const toast = useRef(null);
    
    const gradeServer = new gradesServer();
    useEffect(() => {        
        gradeServer.getGradeForm().then((data) => setGrades(data));
    }, []);

    const hideDialog = () => {
        setGradetDialog(false);
    };

    const saveGrade = () => {        
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

    const editGrade = (grade: any) => {
        setGrade({ ...grade });
        setGradetDialog(true);
    };    

    const submitCommandTemplate = () => {
        const gradeServer = new gradesServer();
        gradeServer.updateUserAuthority().then((data) => setGrades(data));
    }
    
    const scoreBodyTemplate = (rowData: any, type: String) => {
        return (
            <div className='p-field p-col-12 p-md-4'>
                <Knob value={rowData[`${type}`].valueOf()} size={60} readOnly />
            </div>
        );
    };

    const statusBodyTemplate = (rowData: any) => {
        let status = 'Completed';
        if (rowData.result === 0) {
            status = 'No-Scores';
        } else if (rowData.comment === '') {
            status = 'No-Comment';
        }
        return <span className={`product-badge status-${status}`}>{status}.</span>;
    };

    const actionBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <Button
                    icon='pi pi-pencil'
                    className='p-button-rounded p-button-success p-mr-2'
                    onClick={() => editGrade(rowData)}
                    disabled={rowData.complete}
                />
            </React.Fragment>
        );
    };

    const menubar = [
        {
            label: 'User: 01',
            icon: 'pi pi-fw pi-user-edit',
            items: [
                {
                    label: 'Personal',
                    icon: 'pi pi-fw pi-user'
                }, {
                    label: 'General',
                    icon: 'pi pi-fw pi-users'
                }, {
                    separator: true
                }, {
                    label: 'Submit',
                    icon: 'pi pi-fw pi-upload',
                    command: submitCommandTemplate
                }
            ]
        }
    ];

    const header = (
        
        <div className='table-header'>            
            <h5 className='p-m-0'>Grade Form</h5>            
            <span className='p-input-icon-left'>
                <i className='pi pi-search' />
                <InputText type='search' onChange={(e) => setGlobalFilter(e.target.value)} placeholder='Search' />
            </span>            
        </div>
    );

    const headerGroup = (
        <ColumnGroup>
            <Row>
                <Column header='Rank' rowSpan={2} style={{ width: '5%' }} />
                <Column header='Name' rowSpan={2} style={{ width: '15%' }} />
                <Column header='Topic' rowSpan={2} style={{ width: '15%' }} />
                <Column header='Score' colSpan={6} />
                <Column header='Status' rowSpan={2} style={{ width: '10%' }} />
                <Column header='' rowSpan={2} style={{ width: '5%' }} />
            </Row>
            <Row>
                {scoreList.map((item) => (
                    <Column header={item[0].substr(0, 1).toUpperCase() + item[0].substr(1) + item[1]} field={item[0]} sortable />
                ))}
            </Row>
        </ColumnGroup>
    );

    const editDialogFooter = (
        <React.Fragment>
            <Button label='Cancel' icon='pi pi-times' className='p-button-text' onClick={hideDialog} />
            <Button label='Save' icon='pi pi-check' className='p-button-text' onClick={saveGrade} />
        </React.Fragment>
    );

    return (        
        <div className='datatable-selection'>
            <Menubar model={menubar} />
            <Toast ref={toast} />

            <div className='card'>
                <DataTable
                    value={grades}
                    header={header}
                    headerColumnGroup={headerGroup}
                    selectionMode='single'
                    selection={selectedGrade}
                    onSelectionChange={(e) => setSelectedGrade(e.value)}
                    globalFilter={globalFilter}
                >
                    {titleList.map((item) => (
                        <Column field={item} />
                    ))}
                    {scoreList.map((item) => (
                        <Column field={item[0]} body={(e) => scoreBodyTemplate(e, item[0])} />
                    ))}
                    <Column body={statusBodyTemplate} />
                    <Column body={actionBodyTemplate} />
                </DataTable>
            </div>

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
                            <InputNumber value={grade[`${item[0]}`]} onValueChange={(e) => onInputNumberChange(e, item[0])} />
                        </div>
                    ))}
                </div>

                <div className='field'>
                    <label htmlFor='comment'>Comment</label>
                    <InputTextarea value={grade.comment} onChange={(e) => onInputTextareaChange(e, 'comment')} rows={3} cols={20} />
                </div>
            </Dialog>
        </div>
    );
};

export default DataTableSelection;