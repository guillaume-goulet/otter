import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { O3rComponent } from '@o3r/core';
import { CopyTextPresComponent, IN_PAGE_NAV_PRES_DIRECTIVES, InPageNavLink, InPageNavLinkDirective, InPageNavPresService, LocalizationPresComponent } from '../../components/index';

@O3rComponent({ componentType: 'Page' })
@Component({
  selector: 'o3r-localization',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LocalizationPresComponent,
    CopyTextPresComponent,
    IN_PAGE_NAV_PRES_DIRECTIVES
  ],
  templateUrl: './localization.template.html',
  styleUrls: ['./localization.style.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocalizationComponent implements AfterViewInit {
  @ViewChildren(InPageNavLinkDirective)
  private inPageNavLinkDirectives!: QueryList<InPageNavLink>;
  public links$ = this.inPageNavPresService.links$;

  constructor(private inPageNavPresService: InPageNavPresService) {}

  public ngAfterViewInit() {
    this.inPageNavPresService.initialize(this.inPageNavLinkDirectives);
  }
}
