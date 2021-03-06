package upkeep.dbsnpimport;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;


public class TableCreator {

	public void createTable(Connection conn, String tablename, boolean override) throws SQLException{
		
		tablename = tablename.replace("\\s", "");

		
		if(override){
			PreparedStatement ps = conn.prepareStatement("DROP TABLE IF EXISTS "+tablename);
			ps.execute();
			ps.close();
		}
		//, INDEX(RSID) USING HASH, INDEX(START) USING BTREE, INDEX(START, END) USING BTREE
		PreparedStatement ps = conn.prepareStatement("CREATE TABLE "+tablename+" (RSID INT, CHR VARCHAR(127), START INT, END INT, PRIMARY KEY(CHR, RSID, START), INDEX(RSID) USING HASH, INDEX(START) USING BTREE, INDEX(START, END) USING BTREE)"
				+ "PARTITION BY RANGE (start) SUBPARTITION BY LINEAR KEY(chr) SUBPARTITIONS 24 (PARTITION p0 VALUES LESS THAN (8000000),"
						+ "PARTITION p1 VALUES LESS THAN (16000000),"
						+ "PARTITION p2 VALUES LESS THAN (24000000),"
						+ "PARTITION p3 VALUES LESS THAN (32000000),"
						+ "PARTITION p4 VALUES LESS THAN (40000000),"
						+ "PARTITION p5 VALUES LESS THAN (48000000),"
						+ "PARTITION p6 VALUES LESS THAN (56000000),"
						+ "PARTITION p7 VALUES LESS THAN (64000000),"
						+ "PARTITION p8 VALUES LESS THAN (72000000),"
						+ "PARTITION p9 VALUES LESS THAN (80000000),"
						+ "PARTITION p10 VALUES LESS THAN (88000000),"
						+ "PARTITION p11 VALUES LESS THAN (96000000),"
						+ "PARTITION p12 VALUES LESS THAN (104000000),"
						+ "PARTITION p13 VALUES LESS THAN (112000000),"
						+ "PARTITION p14 VALUES LESS THAN (120000000),"
						+ "PARTITION p15 VALUES LESS THAN (128000000),"
						+ "PARTITION p16 VALUES LESS THAN (136000000),"
						+ "PARTITION p17 VALUES LESS THAN (144000000),"
						+ "PARTITION p18 VALUES LESS THAN (152000000),"
						+ "PARTITION p19 VALUES LESS THAN (160000000),"
						+ "PARTITION p20 VALUES LESS THAN (168000000),"
						+ "PARTITION p21 VALUES LESS THAN (176000000),"
						+ "PARTITION p22 VALUES LESS THAN (184000000),"
						+ "PARTITION p23 VALUES LESS THAN (192000000),"
						+ "PARTITION p24 VALUES LESS THAN (200000000),"
						+ "PARTITION p25 VALUES LESS THAN (208000000),"
						+ "PARTITION p26 VALUES LESS THAN (216000000),"
						+ "PARTITION p27 VALUES LESS THAN (224000000),"
						+ "PARTITION p28 VALUES LESS THAN (232000000),"
						+ "PARTITION p29 VALUES LESS THAN MAXVALUE)");
		ps.execute();
		ps.close();
	}
	
}
