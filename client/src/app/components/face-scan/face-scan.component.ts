import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';

// import * as faceapi from 'face-api.js';
// import { Dimensions } from 'face-api.js';

@Component({
  selector: 'app-face-scan',
  templateUrl: './face-scan.component.html',
  styleUrls: ['./face-scan.component.css'],
})
export class FaceScanComponent implements OnInit {
  constructor() {}

  // async ngOnInit() {
  //   // const MODEL_URL = 'assets/weights';
  //   // await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
  //   // await faceapi.loadFaceLandmarkModel(MODEL_URL);
  //   // await faceapi.loadFaceRecognitionModel(MODEL_URL);
  // }

  // async onClick() {
  //   console.log('doing');
  //   const input = document.getElementById('myImage') as any;
  //   this.drawCanvasImage(input);
  //   let fullFaceDescriptions = await faceapi
  //     .detectAllFaces(input)
  //     .withFaceLandmarks()
  //     .withFaceDescriptors();
  //   const x = new Dimensions(input.width, input.height);
  //   fullFaceDescriptions = faceapi.resizeResults(fullFaceDescriptions, x);

  //   var canvas = document.getElementById('myCanvas') as any;
  //   const box =
  //   const drawBox = faceapi.draw.DrawBox()
  //   faceapi.draw.drawDetections(canvas, fullFaceDescriptions);

  // }

  // drawCanvasImage(image: any) {
  //   var canvas = document.getElementById('myCanvas') as any;

  //   canvas.width = image.width;
  //   canvas.height = image.height;

  //   var context = canvas.getContext('2d') as any;

  //   context.drawImage(image, 0, 0, image.width, image.height);
  // }

  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage = null as any;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();

  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      }
    );
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  private imageArray: Array<WebcamImage> = [];

  public handleImage(webcamImage: WebcamImage): void {
    // console.info('received webcam image', webcamImage);
    this.imageArray.push(webcamImage);
    console.log(this.imageArray);
    // this.webcamImage = webcamImage;
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    // this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  public startScan() {
    this.triggerSnapshot();
  }
}
