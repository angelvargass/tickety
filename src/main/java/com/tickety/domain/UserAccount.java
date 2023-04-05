package com.tickety.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tickety.domain.enumeration.Gender;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A UserAccount.
 */
@Entity
@Table(name = "user_account")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserAccount implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "genderu")
    private Gender genderu;

    @OneToMany(mappedBy = "userAccount")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "galery", "artists", "tickets", "userAccount", "organization", "venue" }, allowSetters = true)
    private Set<Event> events = new HashSet<>();

    @OneToMany(mappedBy = "userAccount")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "userAccount" }, allowSetters = true)
    private Set<Roles> roles = new HashSet<>();

    @ManyToOne(cascade = CascadeType.ALL)
    @JsonIgnoreProperties(value = { "contact", "userAccounts", "events" }, allowSetters = true)
    private Organization organization;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @MapsId
    private User user;

    public Long getId() {
        return this.id;
    }

    public UserAccount id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Gender getGenderu() {
        return this.genderu;
    }

    public UserAccount genderu(Gender genderu) {
        this.setGenderu(genderu);
        return this;
    }

    public void setGenderu(Gender genderu) {
        this.genderu = genderu;
    }

    public Set<Event> getEvents() {
        return this.events;
    }

    public void setEvents(Set<Event> events) {
        if (this.events != null) {
            this.events.forEach(i -> i.setUserAccount(null));
        }
        if (events != null) {
            events.forEach(i -> i.setUserAccount(this));
        }
        this.events = events;
    }

    public UserAccount events(Set<Event> events) {
        this.setEvents(events);
        return this;
    }

    public UserAccount addEvent(Event event) {
        this.events.add(event);
        event.setUserAccount(this);
        return this;
    }

    public UserAccount removeEvent(Event event) {
        this.events.remove(event);
        event.setUserAccount(null);
        return this;
    }

    public Set<Roles> getRoles() {
        return this.roles;
    }

    public void setRoles(Set<Roles> roles) {
        if (this.roles != null) {
            this.roles.forEach(i -> i.setUserAccount(null));
        }
        if (roles != null) {
            roles.forEach(i -> i.setUserAccount(this));
        }
        this.roles = roles;
    }

    public UserAccount roles(Set<Roles> roles) {
        this.setRoles(roles);
        return this;
    }

    public UserAccount addRoles(Roles roles) {
        this.roles.add(roles);
        roles.setUserAccount(this);
        return this;
    }

    public UserAccount removeRoles(Roles roles) {
        this.roles.remove(roles);
        roles.setUserAccount(null);
        return this;
    }

    public Organization getOrganization() {
        return this.organization;
    }

    public void setOrganization(Organization organization) {
        this.organization = organization;
    }

    public UserAccount organization(Organization organization) {
        this.setOrganization(organization);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserAccount)) {
            return false;
        }
        return id != null && id.equals(((UserAccount) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserAccount{" +
            "id=" + getId() +
            ", genderu='" + getGenderu() + "'" +
            "}";
    }
}
