import { NgForOf, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonicModule, IonModal } from '@ionic/angular';
import { Item } from './type.interface';

@Component({
  selector: 'mvz-selectable',
  templateUrl: './mvz-selectable.component.html',
  styleUrls: ['./mvz-selectable.component.scss'],
  standalone: true,
  imports: [IonicModule, NgForOf, NgIf],
})
export class MvzSelectable implements OnInit {
  @ViewChild('modal', { static: true }) modal!: IonModal;
  @Input() items: any[] = [];
  @Input() selectedItems: any[] = [];
  @Input() title = 'Select Items';
  @Input() id = Math.floor(Math.random() * (100000 - 1 + 1) + 1)+'-id';
  @Input() searchProperty: string = 'descripcion';
  @Input() returnProperty: string = 'id';
  @Input() multipleSelect: boolean = false;
  selectedItemsText = '0 Items';

  @Output() selectionCancel = new EventEmitter<void>();
  @Output() selectionChange = new EventEmitter<string[]>();

  filteredItems: Item[] = [];
  workingSelectedValues: string[] = [];

  ngOnInit() {
    this.filteredItems = [...this.items];
    this.workingSelectedValues = [...this.selectedItems];
  }

  trackItems(index: number, item: Item) {
    return item.value;
  }

  cancelChanges() {
    this.selectionCancel.emit();
    this.filterList(undefined);
    this.modal.dismiss();
  }

  confirmChanges() {
    this.selectionChange.emit(this.workingSelectedValues);
    this.itemSelectionChanged(this.workingSelectedValues);
    this.filterList(undefined);
    this.modal.dismiss();
  }

  searchbarInput(ev: any) {
    this.filterList(ev.target.value);
  }

  /**
   * Update the rendered view with
   * the provided search query. If no
   * query is provided, all data
   * will be rendered.
   */
  filterList(searchQuery: string | undefined) {
    /**
     * If no search query is defined,
     * return all options.
     */
    if (searchQuery === undefined) {
      this.filteredItems = [...this.items];
    } else {
      /**
       * Otherwise, normalize the search
       * query and check to see which items
       * contain the search query as a substring.
       */
      const normalizedQuery = searchQuery.toLowerCase();
      this.filteredItems = this.items.filter((item) => {
        return item[this.searchProperty].toLowerCase().includes(normalizedQuery);
      });
    }
  }

  isChecked(value: string) {
    return this.workingSelectedValues.find((item) => item === value);
  }

  checkboxChange(ev: any) {
    const { checked, value } = ev.detail;

    if (checked) {
      this.workingSelectedValues = [...this.workingSelectedValues, value];
    } else {
      this.workingSelectedValues = this.workingSelectedValues.filter((item) => item !== value);
    }
  }

  radioGroupChange(ev: any){
    const { value } = ev.detail;

    this.workingSelectedValues = [...this.workingSelectedValues, value];
    this.workingSelectedValues = this.workingSelectedValues.filter((item) => item === value);
  }

  private formatData(data: string[]) {
    if (data.length === 1) {
      const item = this.items.find((item) => item[this.returnProperty] === data[0]);
      if(item != undefined)
        return item[this.searchProperty];
    }

    return `${data.length} items`;
  }

  itemSelectionChanged(items: any[]) {
    this.selectedItems = items;
    this.selectedItemsText = this.formatData(this.selectedItems);
  }
}
