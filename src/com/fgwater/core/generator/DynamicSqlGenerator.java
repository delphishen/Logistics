package com.fgwater.core.generator;

import static org.apache.ibatis.jdbc.SqlBuilder.BEGIN;
import static org.apache.ibatis.jdbc.SqlBuilder.DELETE_FROM;
import static org.apache.ibatis.jdbc.SqlBuilder.INSERT_INTO;
import static org.apache.ibatis.jdbc.SqlBuilder.SET;
import static org.apache.ibatis.jdbc.SqlBuilder.SQL;
import static org.apache.ibatis.jdbc.SqlBuilder.UPDATE;
import static org.apache.ibatis.jdbc.SqlBuilder.VALUES;
import static org.apache.ibatis.jdbc.SqlBuilder.WHERE;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Map;

import javax.persistence.Column;
import javax.persistence.Table;

import com.fgwater.core.annotation.Relation;
import com.fgwater.core.annotation.Relations;
import com.fgwater.core.common.ConstantSys;
import com.fgwater.core.model.BaseModel;
import com.fgwater.core.utils.SessionUtils;
import com.fgwater.core.utils.StrUtils;

/**
 * 
 * description : 动态SQL生成器
 * 
 * creator : 刘必文
 * 
 * createTime : 2015 八月 7 16:38:47
 * 
 * version :
 * 
 * remark :
 * 
 */
@SuppressWarnings("unchecked")
public class DynamicSqlGenerator<T extends BaseModel> {

	/**
	 * 
	 * description : 插入方法
	 * 
	 * creator : 刘必文
	 * 
	 * createTime : 2016 五月 6 16:03:38
	 * 
	 * remark : (修改人，修改时间，修改原因/内容)
	 * 
	 * @param obj
	 * @return
	 * 
	 */
	public String insert(T obj) {
		String time = StrUtils.getCurrFormatTime();
		String userId = SessionUtils.getCurrUserId();
		obj.setCreator(userId);
		obj.setCrTime(time);
		obj.setModifier(userId);
		obj.setMoTime(time);
		obj.setFlag(ConstantSys.SYSTEM_FLAG_VALID);
		StringBuffer sbFields = new StringBuffer();
		StringBuffer sbValues = new StringBuffer();
		String id = obj.id();
		sbFields.append(id);
		sbValues.append("#{" + id + "}");
		Field[] fields = obj.getClass().getDeclaredFields();
		for (Field field : fields) {
			if (field.isAnnotationPresent(Column.class)) {
				String fieldName = field.getName();
				sbFields.append("," + fieldName);
				sbValues.append(",#{" + fieldName + "}");
			}
		}
		sbFields.append(",creator,crTime,modifier,moTime,flag");
		sbValues.append(",#{creator},#{crTime},#{modifier},#{moTime},#{flag}");
		BEGIN();
		INSERT_INTO(obj.table());
		VALUES(sbFields.toString(), sbValues.toString());
		return SQL();
	}

	/**
	 * 
	 * description :更新方法
	 * 
	 * creator : 刘必文
	 * 
	 * createTime : 2016 五月 6 16:03:56
	 * 
	 * remark : (修改人，修改时间，修改原因/内容)
	 * 
	 * @param obj
	 * @return
	 * 
	 */
	public String update(T obj) {
		obj.setModifier(SessionUtils.getCurrUserId());
		obj.setMoTime(StrUtils.getCurrFormatTime());
		StringBuffer sbSet = new StringBuffer();
		Field[] fields = obj.getClass().getDeclaredFields();
		for (Field field : fields) {
			if (field.isAnnotationPresent(Column.class)) {
				String fieldName = field.getName();
				Object fieldValue = this.getFieldValueByName(fieldName, obj);
				if (fieldValue != null) {
					sbSet.append(fieldName).append("=#{").append(fieldName)
							.append("},");
				}
			}
		}
		sbSet.append("modifier=#{modifier},");
		sbSet.append("moTime=#{moTime}");
		String id = obj.id();
		BEGIN();
		UPDATE(obj.table());
		SET(sbSet.toString());
		WHERE(id + "=#{" + id + "}");
		return SQL();
	}

	/**
	 * 
	 * description : 逻辑删除
	 * 
	 * creator : 刘必文
	 * 
	 * createTime : 2016 五月 6 16:04:05
	 * 
	 * remark : (修改人，修改时间，修改原因/内容)
	 * 
	 * @param obj
	 * @return
	 * 
	 */
	public String deleteLogic(T obj) {
		obj.setModifier(SessionUtils.getCurrUserId());
		obj.setMoTime(StrUtils.getCurrFormatTime());
		String id = obj.id();
		BEGIN();
		UPDATE(obj.table());
		SET("flag=" + ConstantSys.SYSTEM_FLAG_INVALID);
		WHERE(id + "=#{" + id + "}");
		return SQL();
	}

	/**
	 * 
	 * description : 物理删除
	 * 
	 * creator : 刘必文
	 * 
	 * createTime : 2016 五月 6 16:04:31
	 * 
	 * remark : (修改人，修改时间，修改原因/内容)
	 * 
	 * @param obj
	 * @return
	 * 
	 */
	public String deletePhysical(T obj) {
		String id = obj.id();
		BEGIN();
		DELETE_FROM(obj.table());
		WHERE(id + "=#{" + id + "}");
		return SQL();
	}

	/**
	 * 
	 * description : 级联逻辑删除
	 * 
	 * creator : 刘必文
	 * 
	 * createTime : 2016 五月 6 16:04:42
	 * 
	 * remark : (修改人，修改时间，修改原因/内容)
	 * 
	 * @param obj
	 * @return
	 * 
	 */
	public String deleteLogicCascade(T obj) {
		String sql = "";
		Field idField = obj.idField();
		obj.setModifier(SessionUtils.getCurrUserId());
		obj.setMoTime(StrUtils.getCurrFormatTime());
		String id = idField.getName();
		BEGIN();
		UPDATE(obj.table());
		SET("flag=" + ConstantSys.SYSTEM_FLAG_INVALID);
		WHERE(id + "=#{" + id + "}");
		sql = SQL();
		if (idField.isAnnotationPresent(Relation.class)) {
			sql += ";";
			Relation re = idField.getAnnotation(Relation.class);
			BEGIN();
			UPDATE(re.table());
			SET("flag=" + ConstantSys.SYSTEM_FLAG_INVALID);
			WHERE(re.field() + "=#{" + id + "}");
			sql += SQL();
		} else if (idField.isAnnotationPresent(Relations.class)) {
			Relations res = idField.getAnnotation(Relations.class);
			for (Relation re : res.value()) {
				sql += ";";
				BEGIN();
				UPDATE(re.table());
				SET("flag=" + ConstantSys.SYSTEM_FLAG_INVALID);
				WHERE(re.field() + "=#{" + id + "}");
				sql += SQL();
			}
		}
		return sql;
	}

	/**
	 * 
	 * description : 物理逻辑删除
	 * 
	 * creator : 刘必文
	 * 
	 * createTime : 2016 五月 6 16:05:05
	 * 
	 * remark : (修改人，修改时间，修改原因/内容)
	 * 
	 * @param obj
	 * @return
	 * 
	 */
	public String deletePhysicalCascade(T obj) {
		String sql = "";
		Field idField = obj.idField();
		String id = idField.getName();
		BEGIN();
		DELETE_FROM(obj.table());
		WHERE(id + "=#{" + id + "}");
		sql = SQL();
		if (idField.isAnnotationPresent(Relation.class)) {
			sql += ";";
			Relation re = idField.getAnnotation(Relation.class);
			BEGIN();
			DELETE_FROM(re.table());
			WHERE(re.field() + "=#{" + id + "}");
			sql += SQL();
		} else if (idField.isAnnotationPresent(Relations.class)) {
			Relations res = idField.getAnnotation(Relations.class);
			for (Relation re : res.value()) {
				sql += ";";
				BEGIN();
				DELETE_FROM(re.table());
				WHERE(re.field() + "=#{" + id + "}");
				sql += SQL();
			}
		}
		return sql;
	}

	/**
	 * 
	 * description : 根据字段删除
	 * 
	 * creator : 刘必文
	 * 
	 * createTime : 2016 五月 6 16:05:17
	 * 
	 * remark : (修改人，修改时间，修改原因/内容)
	 * 
	 * @param m
	 * @return
	 * 
	 */
	public String deleteByField(Map<String, Object> m) {
		Class<T> clazz = (Class<T>) m.get("clazz");
		Table table = clazz.getAnnotation(Table.class);
		String field = m.get("field").toString();
		BEGIN();
		DELETE_FROM(table.name());
		WHERE(field + "=#{value}");
		return SQL();
	}

	/**
	 * 
	 * description : 直接执行sql语句，只能执行insert/update/delete语句，不提倡使用
	 * 
	 * creator : 刘必文
	 * 
	 * createTime : 2016 五月 6 16:05:30
	 * 
	 * remark : (修改人，修改时间，修改原因/内容)
	 * 
	 * @param sql
	 * @return
	 * 
	 */
	public String execute(String sql) {
		return sql;
	}

	/**
	 * 
	 * description : 校验字段是否重复，不成熟的方法
	 * 
	 * creator : 刘必文
	 * 
	 * createTime : 2016 五月 6 16:06:01
	 * 
	 * remark : (修改人，修改时间，修改原因/内容)
	 * 
	 * @param m
	 * @return
	 * 
	 */
	public String check(Map<String, Object> m) {
		T obj = (T) m.get("obj");
		String[] checkFields = m.get("checkFields").toString().split(",");
		String id = obj.idField().getName();
		String sql = "select count(*) as count from " + obj.table()
				+ " where flag = 1 and " + id + "<>'"
				+ this.getFieldValueByName(id, obj) + "'";
		for (String checkField : checkFields) {
			sql += " and " + checkField + "='"
					+ this.getFieldValueByName(checkField, obj) + "'";
		}
		return sql;
	}

	/**
	 * 
	 * description : 根据字段获取对象中对应字段的值
	 * 
	 * creator : 刘必文
	 * 
	 * createTime : 2016 五月 6 16:06:48
	 * 
	 * remark : (修改人，修改时间，修改原因/内容)
	 * 
	 * @param fieldName
	 * @param obj
	 * @return
	 * 
	 */
	private Object getFieldValueByName(String fieldName, Object obj) {
		try {
			String firstLetter = fieldName.substring(0, 1).toUpperCase();
			String getter = "get" + firstLetter + fieldName.substring(1);
			Method method = obj.getClass().getMethod(getter, new Class[] {});
			Object value = method.invoke(obj, new Object[] {});
			return value;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

}
