import './DataTableSelection.css';

import { Row } from 'primereact/row';
import { Knob } from 'primereact/knob';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { ColumnGroup } from 'primereact/columngroup';

import React, { useState, useRef } from 'react';

//props: {titleList, scoreList, grades, dialog}
const DataTableSelection = (props: any) => {
    const toast = useRef(null);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(String);

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
                    icon={`pi ${props.dialogLogo[0]}`}
                    className={`p-button-rounded ${props.dialogLogo[1]} p-mr-2`}
                    onClick={() => props.dialog(rowData)}
                    disabled={rowData.complete}
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
                <Column header='Rank' rowSpan={2} style={{ width: '5%' }} />
                <Column header='Name' rowSpan={2} style={{ width: '15%' }} />
                <Column header='Topic' rowSpan={2} style={{ width: '15%' }} />
                <Column header='Score' colSpan={6} />
                <Column header='Status' rowSpan={2} style={{ width: '10%' }} />
                <Column header='' rowSpan={2} style={{ width: '5%' }} />
            </Row>
            <Row>
                {props.scoreList.map((item: string[]) => (
                    <Column
                        header={item[0].substr(0, 1).toUpperCase() + item[0].substr(1) + item[1]}
                        field={item[0]}
                        sortable
                    />
                ))}
            </Row>
        </ColumnGroup>
    );    

    return (
        <div className='datatable-selection'>
            <Toast ref={toast} />

            <DataTable
                value={props.grades}
                header={header}
                headerColumnGroup={headerGroup}
                selectionMode='single'
                selection={selectedGrade}
                onSelectionChange={(e) => setSelectedGrade(e.value)}
                globalFilter={globalFilter}
            >
                {props.titleList.map((item: string) => (
                    <Column field={item} />
                ))}
                {props.scoreList.map((item: string[]) => (
                    <Column field={item[0]} body={(e) => scoreBodyTemplate(e, item[0])} />
                ))}
                <Column body={statusBodyTemplate} />
                <Column body={actionBodyTemplate} />
            </DataTable>
        </div>
    );
};

export default DataTableSelection;