package com.tickety.repository;

import com.tickety.domain.Galery;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Galery entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GaleryRepository extends JpaRepository<Galery, Long> {}
