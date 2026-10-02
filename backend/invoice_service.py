from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle
)
from reportlab.lib.units import mm
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
INVOICE_DIR = BASE_DIR / "invoices"


def generate_invoice(order_data, order_result):

    INVOICE_DIR.mkdir(exist_ok=True)

    order_id = order_result["order_id"]

    invoice_file = INVOICE_DIR / f"{order_id}.pdf"

    document = SimpleDocTemplate(
        str(invoice_file),
        pagesize=A4,
        rightMargin=20 * mm,
        leftMargin=20 * mm,
        topMargin=20 * mm,
        bottomMargin=20 * mm
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "InvoiceTitle",
        parent=styles["Title"],
        fontSize=26,
        alignment=TA_CENTER,
        spaceAfter=10
    )

    heading_style = ParagraphStyle(
        "Heading",
        parent=styles["Heading2"],
        fontSize=14,
        spaceBefore=10,
        spaceAfter=8
    )

    normal_style = ParagraphStyle(
        "Normal",
        parent=styles["Normal"],
        fontSize=10,
        leading=15
    )

    elements = []

    elements.append(
        Paragraph(
            "FlowerBook",
            title_style
        )
    )

    elements.append(
        Paragraph(
            "Fresh Flowers. Beautiful Moments.",
            ParagraphStyle(
                "Subtitle",
                parent=normal_style,
                alignment=TA_CENTER,
                fontSize=11
            )
        )
    )

    elements.append(Spacer(1, 15))

    elements.append(
        Paragraph(
            f"<b>Booking ID:</b> {order_id}",
            normal_style
        )
    )

    elements.append(
        Paragraph(
            "<b>Status:</b> Confirmed",
            normal_style
        )
    )

    elements.append(Spacer(1, 10))

    elements.append(
        Paragraph(
            "Customer Details",
            heading_style
        )
    )

    customer_data = [
        [
            Paragraph("<b>Name</b>", normal_style),
            Paragraph(str(order_data["customer_name"]), normal_style)
        ],
        [
            Paragraph("<b>Email</b>", normal_style),
            Paragraph(str(order_data["email"]), normal_style)
        ],
        [
            Paragraph("<b>Phone</b>", normal_style),
            Paragraph(str(order_data["phone"]), normal_style)
        ],
        [
            Paragraph("<b>Address</b>", normal_style),
            Paragraph(str(order_data["address"]), normal_style)
        ],
        [
            Paragraph("<b>Delivery Date</b>", normal_style),
            Paragraph(str(order_data["delivery_date"]), normal_style)
        ],
        [
            Paragraph("<b>Delivery Time</b>", normal_style),
            Paragraph(str(order_data["delivery_time"]), normal_style)
        ]
    ]

    customer_table = Table(
        customer_data,
        colWidths=[45 * mm, 115 * mm]
    )

    customer_table.setStyle(
        TableStyle([
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("BACKGROUND", (0, 0), (0, -1), colors.whitesmoke),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6)
        ])
    )

    elements.append(customer_table)

    elements.append(Spacer(1, 15))

    elements.append(
        Paragraph(
            "Order Details",
            heading_style
        )
    )

    order_table_data = [
        [
            Paragraph("<b>Flower</b>", normal_style),
            Paragraph("<b>Qty</b>", normal_style),
            Paragraph("<b>Price</b>", normal_style),
            Paragraph("<b>Total</b>", normal_style)
        ]
    ]

    grand_total = 0

    for item in order_data["items"]:

        name = str(item["name"])
        quantity = int(item["quantity"])
        price = float(item["price"])

        item_total = quantity * price
        grand_total += item_total

        order_table_data.append([
            Paragraph(name, normal_style),
            Paragraph(str(quantity), normal_style),
            Paragraph(f"Rs. {price:.2f}", normal_style),
            Paragraph(f"Rs. {item_total:.2f}", normal_style)
        ])

    order_table_data.append([
        "",
        "",
        Paragraph("<b>Grand Total</b>", normal_style),
        Paragraph(f"<b>Rs. {grand_total:.2f}</b>", normal_style)
    ])

    order_table = Table(
        order_table_data,
        colWidths=[
            75 * mm,
            20 * mm,
            30 * mm,
            35 * mm
        ]
    )

    order_table.setStyle(
        TableStyle([
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ("BACKGROUND", (0, 0), (-1, 0), colors.whitesmoke),
            ("ALIGN", (1, 1), (-1, -1), "CENTER"),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("LEFTPADDING", (0, 0), (-1, -1), 6),
            ("RIGHTPADDING", (0, 0), (-1, -1), 6),
            ("TOPPADDING", (0, 0), (-1, -1), 7),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 7)
        ])
    )

    elements.append(order_table)

    elements.append(Spacer(1, 20))

    if order_data.get("special_message"):

        elements.append(
            Paragraph(
                "Special Message:",
                heading_style
            )
        )

        elements.append(
            Paragraph(
                str(order_data["special_message"]),
                normal_style
            )
        )

        elements.append(Spacer(1, 15))

    elements.append(
        Paragraph(
            "Thank you for choosing FlowerBook!",
            ParagraphStyle(
                "Footer",
                parent=normal_style,
                alignment=TA_CENTER,
                fontSize=11
            )
        )
    )

    document.build(elements)

    return str(invoice_file)