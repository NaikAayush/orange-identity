import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FaceService } from 'src/app/services/face/face.service';

@Component({
  selector: 'app-face-scan',
  templateUrl: './face-scan.component.html',
  styleUrls: ['./face-scan.component.css'],
})
export class FaceScanComponent implements OnInit {
  public clickedStatus: boolean = true;
  public finalImage: boolean = false;

  constructor(
    private storage: AngularFireStorage,
    private faceService: FaceService
  ) {}

  async ngOnInit() {
    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      }
    );
  }

  async onClick() {
    console.log('image');
  }

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

  public async handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
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
    this.clickedStatus = false;
    this.triggerSnapshot();
  }

  async uploadFile(webcamImage: WebcamImage) {
    const filePath = 'aaaaa1.jpg';
    const ref = this.storage.ref(filePath);
    const task = ref.putString(webcamImage.imageAsBase64, 'base64', {
      contentType: 'image/jpg',
    });
  }

  public clickPhoto() {
    this.clickedStatus = false;
    this.finalImage = false;
    this.triggerSnapshot();
  }

  public reset() {
    this.clickedStatus = true;
    this.finalImage = false;
  }

  public async continue() {
    this.clickedStatus = false;
    this.finalImage = true;

    const image = document.getElementById('snap');
    console.log('recognize');
    const res = await this.faceService.recognizeFace(image);
    console.log('assign');
    console.log(res);
    await this.faceService.assignFace('Aayush', [res.descriptor]);
  }
}
