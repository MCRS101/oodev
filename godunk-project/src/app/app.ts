import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./navbar/navbar";
import { Prodcrd } from './prodcrd/prodcrd';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar,Prodcrd],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('godunk-project');
}
