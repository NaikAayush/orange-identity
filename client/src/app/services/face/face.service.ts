import { Injectable } from '@angular/core';
import * as faceapi from 'face-api.js';
import { FaceMatcher, LabeledFaceDescriptors } from 'face-api.js';

@Injectable({
  providedIn: 'root',
})
export class FaceService {
  private MODEL_URL = 'assets/weights';
  private arrayOfLabel: Array<LabeledFaceDescriptors> = [];

  constructor() {
    this.init();
  }

  private async init() {
    await faceapi.loadSsdMobilenetv1Model(this.MODEL_URL);
    // await faceapi.loadTinyFaceDetectorModel(this.MODEL_URL);
    await faceapi.loadFaceLandmarkModel(this.MODEL_URL);
    await faceapi.loadFaceRecognitionModel(this.MODEL_URL);
  }

  registerFace() {}

  public async recognizeFace(image: any): Promise<any> {
    console.log('in recognize');
    try {
      const results = await faceapi
        .detectAllFaces(image)
        .withFaceLandmarks()
        .withFaceDescriptors();
      return results[0];
    } catch (error) {
      return await this.recognizeFace(image);
    }
  }

  public async assignFace(label: string, descriptors: Float32Array[]) {
    console.log('in assign');
    console.log(label, descriptors);
    this.arrayOfLabel.push(new LabeledFaceDescriptors(label, descriptors));
  }

  public async matchFace(
    // faceArray: Array<LabeledFaceDescriptors>,
    faceData: any
  ) {
    console.log('in match');
    // const faceMatcher = new FaceMatcher(faceArray);
    const faceMatcher = new FaceMatcher(this.arrayOfLabel);
    const bestMatch = faceMatcher.findBestMatch(faceData.descriptor);
    console.log(bestMatch.toString());
  }
}
