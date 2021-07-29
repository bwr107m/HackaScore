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
        team: '',
        topic: '',
        maintain: 0,
        innov: 0,
        design: 0,
        skill: 0,
        demo: 0,
        result: 0,
        comment: '',
        judge: '',
        complete: ''
    };
    const titleList = ['rank', 'team', 'topic'];
    const scoreList = ['maintain', 'innov', 'design', 'skill', 'demo'];

    const [grades, setGrades] = useState([]);
    const [grade, setGrade] = useState(emptyGrade);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(String);
    const [gradeDialog, setGradetDialog] = useState(false);

    const toast = useRef(null);    

    useEffect(() => {
        const gradeServer = new gradesServer();
        gradeServer.getGradeForm().then((data) => setGrades(data));
    }, []);

    const hideDialog = () => {
        setGradetDialog(false);
    };

    const saveGrade = () => {
        const gradeServer = new gradesServer();
        gradeServer.updateGradeForm(grade.team, grade.judge, grade).then((data) => setGrades(data));

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
                />
            </React.Fragment>
        );
    };

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
                <Column header='Rank' rowSpan={2} style={{ width: '8%' }} sortable />
                <Column header='Team' rowSpan={2} style={{ width: '15%' }} />
                <Column header='Topic' rowSpan={2} style={{ width: '15%' }} />
                <Column header='Score' colSpan={5} />
                <Column header='Status' rowSpan={2} style={{ width: '10%' }} />
                <Column header='' rowSpan={2} style={{ width: '5%' }} />
            </Row>
            <Row>
                {scoreList.map((item) => (
                    <Column header={item.substr(0, 1).toUpperCase() + item.substr(1)} field={item} sortable />
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
                        <Column field={item} body={(e) => scoreBodyTemplate(e, item)} />
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
                    {scoreList.map((item) => (
                        <div className='field col-4'>
                            <label htmlFor={item}>{item.substr(0, 1).toUpperCase() + item.substr(1)}</label>
                            <InputNumber value={grade[`${item}`]} onValueChange={(e) => onInputNumberChange(e, item)} />
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