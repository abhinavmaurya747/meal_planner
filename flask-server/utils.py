
from fpdf import FPDF


def create_pdf(data, filename):
    try:
        pdf = FPDF()
        pdf.set_auto_page_break(auto=True, margin=15)
        pdf.add_page()

        # Set font for the section header
        pdf.set_font("Arial", 'B', 24)
        pdf.cell(200, 10, txt="Weekly Planned Meal", ln=True, align='C')

        pdf.set_font("Arial", '', 10)
        pdf.cell(200, 10, txt="Created on : "+data['date'], ln=True, align='L')

        # Extract days and meals from the data
        days = list(data["meal_plan"].keys())

        for day in days:
            # Add a section header for each day
            pdf.set_font("Arial", 'B', 14)
            pdf.cell(200, 10, txt=f"{day.capitalize()}: ", ln=True, align='L')

            # Set font for the table content
            pdf.set_font("Arial", 'B', 12)

            # Create a table for the current day
            pdf.set_fill_color(200, 220, 255)
            pdf.cell(40, 10, txt="Meal", border=1, fill=True)
            pdf.cell(150, 10, txt="", border=1, fill=True)
            pdf.ln()

            for meal in data["meal_plan"][day]:
                pdf.set_font("Arial", 'B', 12)
                pdf.cell(40, 10, txt=meal, border=1)
                pdf.set_font("Arial", '', 12)
                pdf.cell(150, 10, txt=data["meal_plan"][day][meal], border=1)
                pdf.ln()

        # Output the PDF to a file
        pdf.output(filename)
    except Exception as e:
        raise  # Re-raise the exception to propagate it up
