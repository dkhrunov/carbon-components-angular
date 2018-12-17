import {
	Directive,
	Input,
	TemplateRef,
	ElementRef,
	Injector,
	ComponentFactoryResolver,
	ViewContainerRef,
	HostBinding,
	HostListener
} from "@angular/core";
import { DialogDirective } from "./../dialog.directive";
import { Tooltip } from "./tooltip.component";
import { DialogService } from "./../dialog.service";


/**
 * Directive for extending `Dialog` to create tooltips.
 *
 * class: TooltipDirective (extends PopoverDirective)
 *
 *
 * selector: `nTooltip`
 *
 *
 * ```html
 * <button nTooltip="I am a tooltip" placement="right" trigger="mouseenter" type="danger">Tooltip Right</button>
 * <button nTooltip="I am a tooltip" type="warning">Tooltip Top warning on click</button>
 * ```
 *
 * @export
 * @class TooltipDirective
 * @extends {DialogDirective}
 */
@Directive({
	selector: "[ibmTooltip]",
	exportAs: "ibmTooltip",
	providers: [
		DialogService
	]
})
export class TooltipDirective extends DialogDirective {
	static tooltipCounter = 0;

	/**
	 * The string or template content to be exposed by the tooltip.
	 */
	@Input() ibmTooltip: string | TemplateRef<any>;
	/**
	 * Set tooltip type to reflect 'warning' or 'error' styles.
	 */
	// tslint:disable-next-line:no-input-rename
	@Input("tooltip-type") tooltipType: "warning" | "error" | "" = "";

	@HostBinding("tabindex") tabIndex = 0;

	@HostBinding("attr.aria-describedby") get descriptorId(): string {
		if (this.expanded) {
			return this.dialogConfig.compID;
		}
	}

	/**
	 * Creates an instance of `TooltipDirective`.
	 */
	constructor(
		protected elementRef: ElementRef,
		protected viewContainerRef: ViewContainerRef,
		protected dialogService: DialogService
	) {
		super(elementRef, viewContainerRef, dialogService);
		dialogService.create(Tooltip);
	}

	/**
	 * Extends the `Dialog` component's data structure with tooltip properties.
	 */
	onDialogInit() {
		TooltipDirective.tooltipCounter++;
		this.dialogConfig.compID = "tooltip-" + TooltipDirective.tooltipCounter;
		this.dialogConfig.content = this.ibmTooltip;
		this.dialogConfig.type = this.tooltipType;
	}

	close() {
		this.dialogService.close(this.viewContainerRef, false);
		this.expanded = false;
	}

	@HostListener("keydown", ["$event"])
	onKeydown(event: KeyboardEvent) {
		if (this.trigger === "click" && (event.key === "Enter" || event.key === " " )) {
			this.open();
		}
		if (event.key === "Escape") {
			this.close();
		}
	}
}
