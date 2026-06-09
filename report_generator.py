import os
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

REPORTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "reports")

def generate_pdf_report(scan_data: dict, vt_data: dict, threat_details: list, output_filename: str = None) -> str:
    """Generates a professional PDF scan report for a URL."""
    if not os.path.exists(REPORTS_DIR):
        os.makedirs(REPORTS_DIR)
        
    if not output_filename:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_filename = f"scan_report_{timestamp}.pdf"
        
    pdf_path = os.path.join(REPORTS_DIR, output_filename)
    
    # Page setup
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        rightMargin=45,
        leftMargin=45,
        topMargin=45,
        bottomMargin=45
    )
    
    story = []
    styles = getSampleStyleSheet()
    
    # Define custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#0F172A'), # Charcoal / Slate 900
        spaceAfter=15
    )
    
    h2_style = ParagraphStyle(
        'SectionHeader',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#1E293B'), # Slate 800
        spaceBefore=15,
        spaceAfter=10
    )
    
    body_style = ParagraphStyle(
        'ReportBody',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#334155') # Slate 700
    )
    
    bold_body_style = ParagraphStyle(
        'ReportBodyBold',
        parent=body_style,
        fontName='Helvetica-Bold'
    )
    
    # 1. Header Section
    story.append(Paragraph("PhishShield Threat Report", title_style))
    story.append(Paragraph(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} (UTC)", body_style))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#3B82F6'), spaceAfter=20, spaceBefore=10))
    
    # 2. Risk Banner Table
    risk = scan_data.get('risk_level', 'Unknown').upper()
    pred = scan_data.get('prediction', 'Unknown')
    conf = scan_data.get('confidence', 0.0) * 100
    
    if risk == 'HIGH' or 'phishing' in pred.lower():
        bg_color = colors.HexColor('#FEE2E2') # Light red
        text_color = colors.HexColor('#DC2626') # Red
        risk_label = "CRITICAL / PHISHING DETECTED"
    elif risk == 'MEDIUM' or 'suspicious' in pred.lower():
        bg_color = colors.HexColor('#FEF3C7') # Light yellow
        text_color = colors.HexColor('#D97706') # Amber
        risk_label = "SUSPICIOUS ACTIVITY DETECTED"
    else:
        bg_color = colors.HexColor('#DCFCE7') # Light green
        text_color = colors.HexColor('#16A34A') # Green
        risk_label = "SAFE WEBSITE"
        
    banner_data = [[
        Paragraph(f"<b>RISK LEVEL: {risk_label}</b><br/>The system has classified this URL as <b>{pred}</b> with <b>{conf:.2f}%</b> confidence.", 
                  ParagraphStyle('BannerText', parent=body_style, textColor=text_color, fontSize=11, leading=16))
    ]]
    
    banner_table = Table(banner_data, colWidths=[520])
    banner_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), bg_color),
        ('BOX', (0,0), (-1,-1), 1.5, text_color),
        ('PADDING', (0,0), (-1,-1), 12),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
    ]))
    
    story.append(banner_table)
    story.append(Spacer(1, 15))
    
    # 3. Scan Metadata Table
    story.append(Paragraph("Scan Metadata", h2_style))
    metadata_data = [
        [Paragraph("<b>Target URL</b>", bold_body_style), Paragraph(scan_data.get('url', ''), body_style)],
        [Paragraph("<b>AI Prediction</b>", bold_body_style), Paragraph(pred, body_style)],
        [Paragraph("<b>Confidence Score</b>", bold_body_style), Paragraph(f"{conf:.2f}%", body_style)],
        [Paragraph("<b>Scanner engine</b>", bold_body_style), Paragraph("PhishShield AI Classifier (XGBoost/GB)", body_style)]
    ]
    
    meta_table = Table(metadata_data, colWidths=[130, 390])
    meta_table.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('BACKGROUND', (0,0), (0,-1), colors.HexColor('#F8FAFC')),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 15))
    
    # 4. Threat Intel & Heuristics Section
    story.append(Paragraph("Threat Intelligence & Heuristics", h2_style))
    
    intel_rows = []
    if not threat_details:
        intel_rows.append([Paragraph("No heuristic threats detected in structure.", body_style)])
    else:
        for threat in threat_details:
            intel_rows.append([
                Paragraph(f"<b>[{threat.get('type', 'Threat')}]</b> {threat.get('details', '')}", body_style)
            ])
            
    intel_table = Table(intel_rows, colWidths=[520])
    intel_table.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('PADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(intel_table)
    story.append(Spacer(1, 15))
    
    # 5. VirusTotal Scan Summary
    story.append(Paragraph("VirusTotal Integration Report", h2_style))
    vt_mal = vt_data.get('malicious', 0)
    vt_susp = vt_data.get('suspicious', 0)
    vt_harm = vt_data.get('harmless', 0)
    vt_undet = vt_data.get('undetected', 0)
    vt_provider = vt_data.get('provider', 'VirusTotal Engine')
    
    vt_summary_data = [
        [
            Paragraph("<b>Malicious Engines</b>", bold_body_style),
            Paragraph("<b>Suspicious Engines</b>", bold_body_style),
            Paragraph("<b>Harmless Engines</b>", bold_body_style),
            Paragraph("<b>Undetected Engines</b>", bold_body_style)
        ],
        [
            Paragraph(f"<font color='red'><b>{vt_mal}</b></font>", body_style),
            Paragraph(f"<font color='orange'><b>{vt_susp}</b></font>", body_style),
            Paragraph(f"<font color='green'><b>{vt_harm}</b></font>", body_style),
            Paragraph(f"<b>{vt_undet}</b>", body_style)
        ]
    ]
    
    vt_table = Table(vt_summary_data, colWidths=[130, 130, 130, 130])
    vt_table.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F1F5F9')),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(vt_table)
    story.append(Paragraph(f"<font size='8'>Intel Provider: {vt_provider}</font>", body_style))
    story.append(Spacer(1, 15))
    
    # 6. Security Recommendations
    story.append(Paragraph("Actionable Recommendations", h2_style))
    
    rec_texts = []
    if risk == 'HIGH' or 'phishing' in pred.lower():
        rec_texts = [
            "<b>DO NOT enter any credentials</b>, personal details, or financial info on this website.",
            "<b>Close the tab immediately</b> and clear browser history or session cache if loaded.",
            "<b>Report the phishing link</b> to standard warning networks (e.g. Google Safe Browsing, APWG).",
            "<b>Notify the system administrator</b> to log this IP/domain blacklist globally inside the network."
        ]
    elif risk == 'MEDIUM' or 'suspicious' in pred.lower():
        rec_texts = [
            "<b>Proceed with extreme caution</b>. Double check the address bar for spelling and character tricks.",
            "<b>Do not download files</b> or allow browser permissions to this domain.",
            "<b>Cross-reference</b> with verified bookmarks or direct searches to access your account.",
            "<b>Consult the AI Assistant</b> inside your dashboard to audit specific features of this page."
        ]
    else:
        rec_texts = [
            "This URL matches standard safe patterns, but continue practicing good cyber security hygiene.",
            "Always check that the address starts with https:// to ensure data in transit is encrypted.",
            "Do not reuse identical passwords across high-profile accounts (bank, emails, social)."
        ]
        
    rec_list = []
    for rec in rec_texts:
        rec_list.append([Paragraph("•", bold_body_style), Paragraph(rec, body_style)])
        
    rec_table = Table(rec_list, colWidths=[20, 500])
    rec_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(rec_table)
    
    # Build Document
    doc.build(story)
    
    return pdf_path
