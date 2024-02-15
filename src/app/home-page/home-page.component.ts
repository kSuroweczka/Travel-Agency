import { Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  images: string[] = [
    'https://img.freepik.com/darmowe-zdjecie/krajobraz-las_71767-127.jpg?size=626&ext=jpg&ga=GA1.1.632798143.1705276800&semt=ais',
    'https://ocdn.eu/pulscms-transforms/1/1dWk9kqTURBXy81OGM4NjViMmU5Y2ExOWJjMTE3YmIxZTVjNWI1NzJlNS5qcGVnk5UDACPNA-jNAjKTBc0EsM0CpJMJpjE2YzFkOQbeAAGhMAE/najpiekniejsze-zdjecia-wielkiej-brytanii.jpeg',
    'https://media.istockphoto.com/id/501057465/pl/zdj%C4%99cie/pokryte-w-g%C3%B3ry-himalaje-mg%C5%82a-i-mg%C5%82a.jpg?s=612x612&w=0&k=20&c=ppsg7SEH9HpMa6FFoBa0uyURGkPaAtxDsULyji35sO0=',
  ];
}
