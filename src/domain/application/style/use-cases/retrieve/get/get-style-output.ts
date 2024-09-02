import { Style, StyleProps } from "@/domain/enterprise/style/style"

export class GetStyleOutput {
  id: string
  companyId: string
  name: string
  isActive: boolean
  backgroundColor: string
  textColor: string
  primaryColor: string
  secondaryColor: string
  tertiaryColor: string

  createdAt: Date
  updatedAt?: Date | null
  deletedAt?: Date | null

  constructor(
    aStyleProps: StyleProps & { id: string },
  ) {
    this.id = aStyleProps.id.toString();
    this.companyId = aStyleProps.companyId.toString();
    this.name = aStyleProps.name;
    this.isActive = aStyleProps.isActive;
    this.backgroundColor = aStyleProps.backgroundColor;
    this.textColor = aStyleProps.textColor;
    this.primaryColor = aStyleProps.primaryColor;
    this.secondaryColor = aStyleProps.secondaryColor;
    this.tertiaryColor = aStyleProps.tertiaryColor;

    this.createdAt = aStyleProps.createdAt;
    this.updatedAt = aStyleProps.updatedAt;
    this.deletedAt = aStyleProps.deletedAt ?? undefined;
  }

  static fromAggregate(
    style: Style,
  ) {
    return new GetStyleOutput(
      style.toJSON(),
    );
  }
}
