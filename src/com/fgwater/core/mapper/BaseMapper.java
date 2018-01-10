package com.fgwater.core.mapper;

import org.apache.ibatis.annotations.DeleteProvider;
import org.apache.ibatis.annotations.InsertProvider;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.ResultType;
import org.apache.ibatis.annotations.SelectProvider;
import org.apache.ibatis.annotations.UpdateProvider;

import com.fgwater.core.generator.DynamicSqlGenerator;
import com.fgwater.core.model.BaseModel;

/**
 * 
 * description : 基础CURD接口
 * 
 * creator : 刘必文
 * 
 * createTime : 2015 八月 7 14:53:25
 * 
 * version :
 * 
 * remark :
 * 
 */
public interface BaseMapper<T extends BaseModel> {

	@InsertProvider(type = DynamicSqlGenerator.class, method = "insert")
	public void insert(T obj);

	@UpdateProvider(type = DynamicSqlGenerator.class, method = "update")
	public void update(T obj);

	@UpdateProvider(type = DynamicSqlGenerator.class, method = "deleteLogic")
	public void deleteLogic(T obj);

	@DeleteProvider(type = DynamicSqlGenerator.class, method = "deletePhysical")
	public void deletePhysical(T obj);

	@UpdateProvider(type = DynamicSqlGenerator.class, method = "deleteLogicCascade")
	public void deleteLogicCascade(T obj);

	@DeleteProvider(type = DynamicSqlGenerator.class, method = "deletePhysicalCascade")
	public void deletePhysicalCascade(T obj);

	@DeleteProvider(type = DynamicSqlGenerator.class, method = "deleteByField")
	public void deleteByField(@Param("clazz")
	Class<T> clazz, @Param("field")
	String field, @Param("value")
	String value);

	@UpdateProvider(type = DynamicSqlGenerator.class, method = "execute")
	public void execute(String sql);

	@SelectProvider(type = DynamicSqlGenerator.class, method = "check")
	@ResultType(Integer.class)
	public Integer check(@Param("obj")
	T obj, @Param("checkFields")
	String checkFields);
}
