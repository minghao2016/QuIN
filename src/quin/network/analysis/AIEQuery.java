package quin.network.analysis;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.LinkedList;
import java.util.TreeMap;

import quin.web.networkjson.Edge;

public class AIEQuery {

	public int getNodeCount(Connection conn, long fid, int maxsize, int minsize) throws SQLException {
		String nodetable = "chiapet.Nodes_"+fid; // TODO
		String cctable = "chiapet.ConnectedComponents_"+fid;
		String sql = "SELECT count(*) FROM "
				+ nodetable + " AS n, "+cctable+" AS cc WHERE n.ccid = cc.id AND cc.nodecount <= ? AND cc.nodecount >= ?";
		PreparedStatement ps = conn.prepareStatement(sql);
		ps.setInt(1, maxsize);
		ps.setInt(2, minsize);
		ResultSet rs = ps.executeQuery();
		rs.next();
		int rv = rs.getInt(1);
		rs.close();
		ps.close();
		return rv;
	}
	
	public Integer[][] getNodeIds(Connection conn, String schema, long fid, Integer[] indices, int maxsize, int minsize) throws SQLException{
		String indextable = schema+".SIIndex_"+fid;
		String nodetable = "chiapet.Nodes_"+fid;
		String cctable = "chiapet.ConnectedComponents_"+fid;

		PreparedStatement ps;
			
		String vals = "-1";
		for(int i = 0; i < indices.length; i++){
			vals += ",?";
		}
			
		String sql = "SELECT DISTINCT i.iid, i.nid FROM "+indextable+" AS i, "+nodetable+" AS n, "+cctable+" AS cc WHERE i.iid IN("+vals+") AND i.nid = n.id AND n.ccid = cc.id AND cc.nodecount <= ? AND cc.nodecount >= ?";
		
		ps = conn.prepareStatement(sql);
		for(int i = 0; i < indices.length; i++){
			ps.setInt(i+1, indices[i]);
		}
		
		ps.setInt(indices.length+1, maxsize);
		ps.setInt(indices.length+2, minsize);


		ResultSet rs = ps.executeQuery();
		LinkedList<Integer[]> l = new LinkedList<Integer[]>();
		while(rs.next()){
			l.add(new Integer[] { rs.getInt(1), rs.getInt(2) });
		}
		rs.close();
		ps.close();
		
		return l.toArray(new Integer[0][]);
	}
	
	public Edge[] getEdges(Connection conn, long fid, int maxsize, int minsize) throws SQLException {
		String edgetable = "chiapet.Edges_"+fid; // TODO
		String cctable = "chiapet.ConnectedComponents_"+fid;

		String sql = "SELECT e.id, e.n1, e.n2, e.petcount, e.interactioncount FROM "
				+ edgetable + " AS e, "+cctable+" AS cc WHERE e.ccid = cc.id AND cc.nodecount <= ? AND cc.nodecount >= ?";

		PreparedStatement ps = conn.prepareStatement(sql);
		ps.setInt(1, maxsize);
		ps.setInt(2, minsize);

		ResultSet rs = ps.executeQuery();

		LinkedList<Edge> l = new LinkedList<Edge>();
		while (rs.next()) {
			int id = rs.getInt(1);
			int n1 = rs.getInt(2);
			int n2 = rs.getInt(3);
			int petcount = rs.getInt(4);
			int icount = rs.getInt(5);

			Edge e = new Edge();
			e.setId(id);
			e.setNode1(n1);
			e.setNode2(n2);
			e.setPETCount(petcount);
			e.setInteractionCount(icount);

			l.add(e);
		}

		rs.close();
		ps.close();

		return l.toArray(new Edge[0]);
	}
	
	public Edge[] getAdjustedNodeIdEdges(Edge[] edges){
		TreeMap<Integer, Integer> m = new TreeMap<Integer, Integer>();
		Edge[] rv= new Edge[edges.length];
		int count = 0;
		for(int i = 0;i < edges.length; i++){
			Edge e = edges[i];
			int n1 = e.getNode1();
			int n2 = e.getNode2();
			if(!m.containsKey(n1)){
				m.put(n1, count++);
			}
			if(!m.containsKey(n2)){
				m.put(n2, count++);
			}
			rv[i] = new Edge();
			rv[i].setId(e.getId());
			rv[i].setNode1(m.get(n1));
			rv[i].setNode2(m.get(n2));
			rv[i].setPETCount(e.getPETCount());
			rv[i].setInteractionCount(e.getInteractionCount());
		}
		return rv;
	}
	
	public int getMaxIndex(Edge[] edges){
		int max = -1;
		for(int i = 0; i < edges.length; i++){
			max = Math.max(Math.max(edges[i].getNode1(), edges[i].getNode2()), max);
		}
		return max;
	}
	
}
