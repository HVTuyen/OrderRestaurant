import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import RobotoRegular from './Roboto-Regular.ttf';

// Load custom fonts
Font.register({
  family: 'Open Sans',
  fonts: [
    { src: RobotoRegular }, // Regular
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Open Sans',
  },
  header: {
    fontSize: 24,
    margin: '20 auto 20 auto',
  },
  detail: {
    flexDirection: 'row',
    width: '100%',
    margin: '8 24 8 24'
  },
  title: {
    fontSize: 14,
    fontWeight: '200',
    width: '40%'
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    width: '60%'
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    margin: '0 26 12 26'
  },
  tableRow: {
    flexDirection: 'row',
    borderStyle: 'solid',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    fontWeight: 'bold',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
});

// Create Document Component
export const MyDocument = ({ Prop }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text>Thông tin đơn hàng</Text>
      </View>

      <View style={styles.detail}>
        <Text style={styles.title}>Bàn order: </Text>
        <Text style={styles.description}>{Prop.tableName}</Text>
      </View>
      <View style={styles.detail}>
        <Text style={styles.title}>Thời gian lập hóa đơn: </Text>
        <Text style={styles.description}>{Prop.paymentTime}</Text>
      </View>
      <View style={styles.detail}>
        <Text style={styles.title}>Nhân viên phụ trách: </Text>
        <Text style={styles.description}>{Prop.employeeName}</Text>
      </View>
      <View style={styles.detail}>
        <Text style={styles.title}>Tổng tiền: </Text>
        <Text style={styles.description}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Prop.totalAmount)}</Text>
      </View>

      <View style={styles.detail}>
        <Text>Danh sách món ăn:</Text>
      </View>
      <View style={styles.table}>
        {/* Tiêu đề cột */}
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCell}>Tên món</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCell}>Số lượng</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCell}>Đơn giá</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCell}>Thành tiền</Text>
          </View>
        </View>
        {/* Dữ liệu hàng */}
        {Prop?.allFoods?.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.nameFood}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.quantity}</Text>
            </View><View style={styles.tableCol}>
              <Text style={styles.tableCell}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.unitPrice)}</Text>
            </View><View style={styles.tableCol}>
              <Text style={styles.tableCell}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.totalPrice)}</Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);