import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { CsvValidatorService } from '../csv-validator.service';
import { CSVRecord } from '../model/CSVRecord';
// import { LoadingIndicatorService } from '../services/loadingIndicatorService.service';
// import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';


interface ProcedureCallObj {
  procedureName: string;
  batchId: string;
  date: Date;
  systemNo: Number;
  environmentSelected: string;
  request_id: string;
}

@Component({
  selector: 'app-programmingpricetest',
  templateUrl: './programming-price.component.html',
  // styleUrls : ['../sections/common.css']
})
export class ProgrammingPriceComponent implements OnInit, OnDestroy {
  filesToUpload: Array<File>;
  fileSelected: File;
  environments: string[] = [];
  systemNos: Number[] = [];
  environmentSelected: string;
  noEnvironmentFlag: boolean = false;
  noEnvironmentFlagDS = false;
  noFileFlag: boolean = false;
  responseMsg: string;
  dataSaved = false;
  pu_prBatchId: string;
  batchIdPromoJobs: string;
  systmNoSelected: string;
  procedureObj: any;
  date: Date;
  procedureExecuted: boolean = true;
  procedureResponse: string;
  showError: boolean = false;
  dataSeedErrorMsg: string;
  busy: Promise<any>;
  loading: boolean;
  message: string = null;
  aliveComponent: boolean = true;
  subscr: Subscription;
  request_id: string;
  status: string;
  fileReaded: any;
  csv: string = null;
  allKeyPreset: boolean = false;
  csvRecords: string[];

  ngOnInit() {
  }

  ngOnDestroy() {

    this.aliveComponent = false;
  }

  constructor(
    private httpService: HttpClient
    //  private loadingIndicatorService: LoadingIndicatorService
  ) {


    this.environments.push('ACP-01');
    this.environments.push('ACP-02');
    this.environments.push('ACP-03');
    this.environments.push('ACP-04');
    this.environments.push('Promo-10g');

    // loadingIndicatorService
    //   .onLoadingChanged
    //   .subscribe(isLoading => {
    //     console.log('******* is loading in search component: ' + isLoading);
    //     this.loading = isLoading;
    //   });

  }

  fileChangeEvent(fileInput: any) {
    console.log("FileChangeEvent", fileInput);

    this.filesToUpload = <Array<File>>fileInput.target.files;
    this.fileSelected = fileInput.target.files.item(0);
    // this.csvValidatorService.CSVFileValidator(this.fileSelected);
  }




  // Getting the header array 
  getHeaderArray(csvRecordsArr: any) {
    let headers = csvRecordsArr[0].split(',');
    let headerArray = [];

    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    console.log('Now sending this to validation', headerArray);
    this.validateHeaders(headerArray);
    return headerArray;
  }

  //validate the header array against the predefined fields
  validateHeaders(headerArray: any) {
    console.log('header value', headerArray);
    var csvRecord: CSVRecord = new CSVRecord();
    console.log('first value of header', headerArray[1]);
    if (headerArray[0] !== csvRecord.PROG_PKG_ID) {
      console.error('PROG_PKG_ID is not at the defined place');
    } if (headerArray[1] !== csvRecord.BILLING_CD) {
      console.error('BILLING_CD is not at the defined place');
    } if (headerArray[2] !== 'SERVICE_CD') {
      console.error('SERVICE_CD is not at the defined place');
    } if (headerArray[3] !== csvRecord.PRIN_NO) {
      console.error('PRIN_NO is not at the defined place');
    } if (headerArray[4] !== csvRecord.AGENT_NO) {
      console.error('AGENT_NO is not at the defined place');
    } if (headerArray[5] !== csvRecord.OLD_AMT) {
      console.error('OLD_AMT is not at the defined place');
    } if (headerArray[6] !== csvRecord.NEW_AMT) {
      console.error('NEW_AMT is not at the defined place');
    } if (headerArray[7] !== csvRecord.RATE_CHANGE_DATE) {
      console.log('RATE_CHANGE_DATE the fields are valid and in place');
    } if (headerArray[8] !== csvRecord.PACKAGE_TYPE) {
      console.log('PACKAGE_TYPE the fields are valid and in place');
    } if (headerArray[9] !== csvRecord.BATCH_ID) {
      console.log('BATCH_ID is not at the defined place');
    } if (headerArray[10] !== csvRecord.REC_CREATE_DATE) {
      console.log('REC_CREATE_DATE is not at the defined place');
    } if (headerArray[11] !== csvRecord.REC_CREATE_USERID) {
      console.error('REC_CREATE_USERID is not at the defined place');
    }
    console.log('Headers are fine');
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    var dataArr = []

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let data = csvRecordsArray[i].split(',');
      // FOR EACH ROW IN CSV FILE IF THE NUMBER OF COLUMNS         
      // ARE SAME AS NUMBER OF HEADER COLUMNS THEN PARSE THE DATA        

      if (data.length == headerLength) {
        var csvRecord: CSVRecord = new CSVRecord();
        console.log('first header', data[0]);
        // csvRecord.firstName = data[0];  
        // csvRecord.lastName = data[1];
        // // .trim();         
        // csvRecord.email = data[2];
        // // .trim();         
        // csvRecord.phoneNumber = data[3];
        // // .trim();      
        // csvRecord.title = data[4];
        // // .trim();      
        // csvRecord.occupation = data[5];
        // .trim();                           
        dataArr.push(csvRecord);
      } else {
        console.log('length of the headers is not matching the length')
      }
    }
    return dataArr;
  }


  fileChangeListener($event: any): void {
    var text = [];
    var files = $event.srcElement.files;
    console.log('this is filechangelistner');
    // if (this.isCSVFile(files[0])) {
    var input = $event.target;
    var reader = new FileReader();
    reader.readAsText(input.files[0]);

    reader.onload = (data) => {
      var csvData = reader.result as any;

      let csvRecordsArray = csvData.split(/\r\n|\n/);
      console.log('after split', csvRecordsArray);
      console.log('length of the array', csvRecordsArray.length)
      let headersRow = this.getHeaderArray(csvRecordsArray);
      this.csvRecords =
        this.getDataRecordsArrayFromCSVFile(csvRecordsArray,
          headersRow.length);
    }

    reader.onerror = function () {
      alert('Unable to read ' + input.files[0]);
    };

  }

  onInput($event) {
    $event.preventDefault();
    console.log('selected: ' + $event.target.value);
    this.environmentSelected = $event.target.value;
  }

  validateFlag() {
    this.noEnvironmentFlag = false;
    this.noFileFlag = false;
    this.noEnvironmentFlagDS = false;
  }

  upload() {
    console.log("")
    this.responseMsg = '';
    this.dataSaved = false;

    if (typeof this.environmentSelected === 'undefined') {
      this.noEnvironmentFlag = true;
      return;
    }
    if (this.filesToUpload.length < 1) {
      this.noFileFlag = true;
      return;
    }
    this.makeFileRequest("/fileUpload", [], this.filesToUpload).then((result) => {
      console.log('upload => dataseeded done => result => ' + result);
      this.dataSaved = true;
      this.responseMsg = result.toString();
    }, (error) => {
      this.dataSaved = true;
      this.responseMsg = 'Failed.'; // error.toString();
    });
  }

  makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
    return new Promise((resolve, reject) => {
      const formData: any = new FormData();
      for (var i = 0; i < files.length; i++) {
        console.log('makeFileRequest => file[i].name =>' + files[i].name);
        console.log('file type => file[i].type => ' + files[i].type);
        formData.append("uploads[]", files[i], "file");
        this.handleFileSelect(files[i]);
      }
      formData.append("environment", this.environmentSelected);
      this.httpService.post(url, formData).subscribe(
        data => {
          console.log('data came from server => ' + JSON.stringify(data));
          resolve(data);
        },
        (err: HttpErrorResponse) => {
          // console.log('Server error as there is no proper server configured yet');
          console.log('error came from server =>' + JSON.stringify(err));    // SHOW ERRORS IF ANY.
          reject(err);
        }
      );
    });
  }

  handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    var file = files[0];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (event) => {
      var csv = reader.result; // Content of CSV file
      let csvData = csv as string;
      console.log('this file data', csvData.replace(/['"]+/g, ''));

      let allTextLines = csvData.replace(/['"]+/g, '').split(/\r\n|\n/);
      let headers = allTextLines[0].split(',');

      console.log('hearder data', headers[0]);
      this.validateHeaders(headers);
      let lines = [];

      for (let i = 0; i < allTextLines.length; i++) {
        // split content based on comma
        let data = allTextLines[i].split(',');
        if (data.length == headers.length) {
          let tarr = [];
          for (let j = 0; j < headers.length; j++) {
            tarr.push(data[j]);
          }
          lines.push(tarr);
        }
      }
      console.log('the below is the data read from the csv file==> \n' + lines); //The data in the form of 2 dimensional array.
    }

  }


  unsubscribe() {
    this.subscr.unsubscribe();
  }
}
