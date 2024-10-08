import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ServicoService } from './servico.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'frontends';

  constructor(
    private servico: ServicoService
  ){

  }

  ngOnInit(): void {
      console.log("iniciou corretamente");
      this.servico.get().subscribe({
        next: resposta =>{
          console.log(resposta);
        }
      })
  }


}
