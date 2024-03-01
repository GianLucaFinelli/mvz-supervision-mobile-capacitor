import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GoogleCloudVisionService {
  constructor(public http: HttpClient) {}

  getLabels(base64Image: string | undefined) {
    if(!base64Image) return new Observable<LABEL_DETECTION_RESPONSE>;
    const body = {
      requests: [
        {
          features: [
            {
              type: 'LABEL_DETECTION',
              maxResults: 10,
            },
          ],
          image: {
            content: base64Image,
          },
        },
      ],
    };
    return this.http.post<LABEL_DETECTION_RESPONSE>(
      'https://vision.googleapis.com/v1/images:annotate?key=' +
        environment.google.cloudVisionAPIKey,
      body
    );
  }
}
export interface LABEL_DETECTION_RESPONSE {
  responses: Response[]
}

export interface Response {
  labelAnnotations: LabelAnnotation[]
}

export interface LabelAnnotation {
  mid: string
  description: string
  score: number
  topicality: number
}
