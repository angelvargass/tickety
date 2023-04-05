package com.tickety.repository;

import com.tickety.domain.User;
import com.tickety.domain.UserAccount;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the UserAccount entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
    Optional<UserAccount> findByUser(User user);
}
